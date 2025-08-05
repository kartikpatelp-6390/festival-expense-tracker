const FundTransaction = require("../models/FundTransaction");
const House = require("../models/House");
const queryHelper = require("../utils/queryHelper");
const normalizePhone = require('../utils/commonUtils');
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const numberToWords = require("number-to-words");
const { uploadToS3 } = require('../utils/s3Uploader');
const generateShortLink = require('../utils/generateShortLink');

exports.registerFund = async (req, res) => {
    try {
        const data = req.body;

        if (data.type === "house" && !data.houseId) {
            return res.status(400).json({ error: "houseId is required for type 'house'" });
        }

        let finalPhone = '';
        if (req.body.type === "house" && req.body.houseId) {
            finalPhone = normalizePhone(req.body.alternativePhone);
        } else {
            delete req.body.alternativePhone;
        }

        const formData = {
            ...req.body,
            alternativePhone: finalPhone,
        }

        // If volunteerId is empty, remove it from the record
        if (req.body.volunteerId === '') {
            formData.volunteerId = null;
        }

        const fund = await FundTransaction.create(formData);
        const populated = await fund.populate("houseId");
        res.status(201).json({ message: "Fund saved", data: populated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFund = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.houseId === '') {
            delete req.body.houseId; // Remove invalid empty string
        }

        let finalPhone = '';
        if (req.body.type === "house" && req.body.houseId) {
            finalPhone = normalizePhone(req.body.alternativePhone);
        } else {
            delete req.body.alternativePhone;
        }

        const formData = {
            ...req.body,
            alternativePhone: finalPhone,
        }

        // If volunteerId is empty, remove it from the record
        if (req.body.volunteerId === '') {
            formData.volunteerId = null;
        }

        const fund = await FundTransaction.findByIdAndUpdate(id, formData, { new: true });
        const populatedFund = await fund.populate([
            { path: "houseId" },
            { path: "volunteerId" }
        ]);
        res.status(201).json({ message: "Fund updated", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getFund = async (req, res) => {
    try {
        const { id } = req.params;
        const fund = await FundTransaction.findById(id, req.body, { new: true }).populate("houseId").populate("volunteerId");
        res.json({ message: "Fund detail", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listFunds = async (req, res) => {
    try {
        let searchFields = ["name", "reference"]; // fields to search by text
        const populateOptions = ["houseId", "volunteerId"];

        // Destructure to exclude startDate and endDate
        const { startDate, endDate, ...queryWithoutDates } = req.query;

        const filters = { ...queryWithoutDates };

        if (filters.festivalYear) {
            filters.festivalYear = Number(filters.festivalYear);
        }

        // 🎯 Date range filter (only on date field, not timestamps)
        if (startDate || endDate) {
            filters.date = {};
            if (startDate) filters.date.$gte = new Date(`${startDate}T00:00:00Z`);
            if (endDate) filters.date.$lte = new Date(`${endDate}T23:59:59Z`);
        }

        const result = await queryHelper(
            FundTransaction, filters, searchFields, populateOptions
        );

        // Post-process each fund record
        result.data = result.data.map(fund => {
            if (fund.type === 'house' && fund.houseId && fund.name === '' && fund.houseId.ownerName) {
                return {
                    ...fund.toObject(), // convert Mongoose doc to plain JS object
                    name: fund.houseId.ownerName
                };
            }
            return fund;
        });

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.summary = async (req, res) => {
    const { festivalYear } = req.query;
    try {
        const result = await FundTransaction.aggregate([
            { $match: { festivalYear: Number(festivalYear) } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFund = async (req, res) => {
    try {
        const { id } = req.params;
        await FundTransaction.findByIdAndDelete(id);
        res.json({ message: "Fund deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.downloadReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        const action = req.query.action || 'download';
        const fund = await FundTransaction.findById(id).populate("houseId");

        if (!fund) {
            res.status(404).json({error: "Unable to find fund"});
        }

        fund.amountInWords = toTitleCase(numberToWords.toWords(fund.amount));

        const date = new Date(fund.date);
        fund.formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const templateDir = path.join(__dirname, "../templates");
        const templatePath = path.join(templateDir, "fund-receipt.ejs");

        const logoPath = path.join(templateDir, 'logo.png');
        const logoBuffer = fs.readFileSync(logoPath);
        const base64Image = `data:image/png;base64,${logoBuffer.toString('base64')}`;

        const footerLogoPath = path.join(templateDir, 'ram.png');
        const footerLogoBuffer = fs.readFileSync(footerLogoPath);
        const base64ImageFooter = `data:image/png;base64,${footerLogoBuffer.toString('base64')}`;

        const html = await ejs.renderFile(templatePath, { fund, imagePath: base64Image, footerImagePath: base64ImageFooter });

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ width: "175mm", height: "105mm" });

        await browser.close();

        if (action === 'send') {
            const s3Url = await uploadToS3(pdfBuffer, `receipt_${id}.pdf`);
            return res.send({ url: s3Url });

            // const shortUrl = await generateShortLink(s3Url);
            // return res.send({ url: shortUrl });
        } else {
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=receipt_${fund._id}.pdf`,
            });

            res.send(pdfBuffer);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUnregisteredHouses = async (req, res) => {
    try {
        const { festivalYear } = req.query;

        if (!festivalYear) {
            return res.status(400).json({ error: "festivalYear is required" });
        }

        const registeredHouseIds = await FundTransaction.distinct("houseId", {
            type: "house",
            festivalYear: parseInt(festivalYear),
        });

        const houses = await House.find({
            _id: { $nin: registeredHouseIds },
        });

        // Natural alphanumeric sort by houseNumber
        const sortedHouses = houses.sort((a, b) => {
            const regex = /^([A-Za-z]+)-?(\d+)?$/;
            const [, letterA = "", numA = "0"] = a.houseNumber.match(regex) || [];
            const [, letterB = "", numB = "0"] = b.houseNumber.match(regex) || [];

            const letterCompare = letterA.localeCompare(letterB);
            if (letterCompare !== 0) return letterCompare;

            return parseInt(numA) - parseInt(numB);
        });

        res.json({ success: true, sortedHouses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSummaryByVolunteers = async (req, res) => {
    try {
        const { festivalYear } = req.query;
        const parsedYear = parseInt(festivalYear);

        // Volunteer-based collection (exclude Cash)
        const volunteers = await FundTransaction.aggregate([
            {
                $match: {
                    festivalYear: parsedYear,
                    volunteerId: { $ne: null }  // only entries linked to volunteers
                }
            },
            {
                $group: {
                    _id: "$volunteerId",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "volunteers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "volunteer"
                }
            },
            { $unwind: "$volunteer" },
            {
                $project: {
                    _id: 1,
                    volunteerName: "$volunteer.name",
                    totalAmount: 1,
                    count: 1
                }
            },
            { $sort: { volunteerName: 1 } }
        ]);

        // Cash collection (not linked to volunteers)
        const cashResult = await FundTransaction.aggregate([
            {
                $match: {
                    festivalYear: parsedYear,
                    paymentMethod: "Cash",
                    $or: [
                        { volunteerId: null },
                        { volunteerId: { $exists: false } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const cash = cashResult.length > 0
            ? {
                volunteerName: "Cash",
                totalAmount: cashResult[0].totalAmount,
                count: cashResult[0].count
            }
            : {
                volunteerName: "Cash",
                totalAmount: 0,
                count: 0
            };

        res.json({ volunteers, cash });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong", details: error });
    }
}

function toTitleCase(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}