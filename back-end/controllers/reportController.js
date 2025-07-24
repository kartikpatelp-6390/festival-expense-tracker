const express = require("express");
const mongoose = require("mongoose");

const FundTransaction = require("../models/FundTransaction");
const Festival = require("../models/Festival");
const FestivalExpense = require("../models/Expense");

exports.getYearlyReport = async (req, res) => {
    const { year } = req.query;
    if (!year) return res.status(400).json({ error: "year is required" });

    try {
        const numericYear = Number(year);

        // 1. Total Fund Collected by Source
        const fundSummary = await FundTransaction.aggregate([
            { $match: { festivalYear: numericYear } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const totalIncome = fundSummary.reduce((sum, item) => sum + item.totalAmount, 0);

        // 2. Find all festivals in this year
        const festivals = await Festival.find({ year: numericYear }).select("_id");

        const festivalIds = festivals.map(f => f._id);

        // 3. Total Expense
        const expenseSummary = await FestivalExpense.aggregate([
            { $match: { festivalId: { $in: festivalIds } } },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" }
                }
            }
        ]);

        const totalExpenses = expenseSummary[0]?.totalExpenses || 0;
        const balance = totalIncome - totalExpenses;

        // 4. Final Report
        res.json({
            year: numericYear,
            funds: fundSummary.reduce((obj, item) => {
                obj[item._id] = item.totalAmount;
                return obj;
            }, {}),
            totalIncome,
            totalExpenses,
            balance
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.festivalBreakDownReport = async (req, res) => {
    const { year } = req.query;

    try {
        const numericYear = year ? Number(year) : new Date().getFullYear();

        // Step 1: Fetch festivals for the year
        const festivals = await Festival.find({ year: numericYear }).lean();

        if (!festivals.length) return res.json([]);

        const festivalIds = festivals.map(f => f._id);

        // Step 2: Group expenses by festival + category
        const expenseData = await FestivalExpense.aggregate([
            { $match: { festivalId: { $in: festivalIds } } },
            {
                $group: {
                    _id: {
                        festivalId: "$festivalId",
                        category: "$category"
                    },
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        // Step 3: Structure response
        const breakdownMap = {};

        for (const item of expenseData) {
            const { festivalId, category } = item._id;
            if (!breakdownMap[festivalId]) breakdownMap[festivalId] = {};
            breakdownMap[festivalId][category] = item.totalAmount;
        }

        // Step 4: Merge with festival info
        const result = festivals.map(fest => {
            const expenses = breakdownMap[fest._id] || {};
            const total = Object.values(expenses).reduce((a, b) => a + b, 0);
            return {
                festivalId: fest._id,
                name: fest.name,
                date: fest.date,
                totalExpense: total,
                expensesByCategory: expenses
            };
        });

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getIncomeExpenseReport = async (req, res) => {
    try {
        const { year } = req.query;
        const festivalYear = year ? { festivalYear: Number(year) } : {};

        // 1. Get cumulative income
        const incomeAgg = await FundTransaction.aggregate([
            ...(festivalYear ? [{ $match: festivalYear }] : []),
            { $group: { _id: null, totalIncome: { $sum: '$amount' } } }
        ]);
        const totalIncome = incomeAgg[0]?.totalIncome || 0;

        // 2. Get expenses with populated festival info
        const expenses = await FestivalExpense.find(festivalYear)
            .populate('festivalId', 'name');

        // 3. Group expenses by festival
        const groupedExpenses = {};
        let totalExpense = 0;

        expenses.forEach(exp => {
            const festName = exp.festivalId?.name || 'Unknown';
            if (!groupedExpenses[festName]) groupedExpenses[festName] = [];
            groupedExpenses[festName].push({
                title: exp.description,
                amount: exp.amount
            });
            totalExpense += exp.amount;
        });

        // 4. Final balance
        const balance = totalIncome - totalExpense;

        // 5. Return structured response
        res.json({
            success: true,
            data: {
                income: totalIncome,
                expenses: groupedExpenses,
                totalExpense,
                balance
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports;