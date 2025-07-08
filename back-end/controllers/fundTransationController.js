const FundTransaction = require("../models/FundTransaction");
const queryHelper = require("../utils/queryHelper");
const normalizePhone = require('../utils/commonUtils');
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const numberToWords = require("number-to-words");
const { uploadToS3 } = require('../utils/s3Uploader');

exports.registerFund = async (req, res) => {
    try {
        const data = req.body;

        if (data.type === "house" && !data.houseId) {
            return res.status(400).json({ error: "houseId is required for type 'house'" });
        }

        const fund = await FundTransaction.create(data);
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

        const fund = await FundTransaction.findByIdAndUpdate(id, formData, { new: true });
        const populated = await fund.populate("houseId");
        res.status(201).json({ message: "Fund updated", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getFund = async (req, res) => {
    try {
        const { id } = req.params;
        const fund = await FundTransaction.findById(id, req.body, { new: true }).populate("houseId");
        res.json({ message: "Fund detail", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listFunds = async (req, res) => {
    try {
        let searchFields = ["name", "reference"]; // fields to search by text
        const populateOptions = ["houseId"];

        req.query.festivalYear = req.query.festivalYear ? Number(req.query.festivalYear) : {};
        const result = await queryHelper(
            FundTransaction, req.query, searchFields, populateOptions
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

        const templatePath = path.join(__dirname, "../templates/fund-receipt.ejs");

        const html = await ejs.renderFile(templatePath, { fund });

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ width: "175mm", height: "95mm" });

        await browser.close();

        if (action === 'send') {
            const s3Url = await uploadToS3(pdfBuffer, `receipt_${id}.pdf`);
            return res.send({ url: s3Url });
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

function toTitleCase(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}