const express = require("express");
const router = new express.Router();
const db = require("../db");

router.post("/", async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const result = await db.query(
          `INSERT INTO industries (code, industry) 
           VALUES ($1, $2) 
           RETURNING code, industry`,[code, industry]);
        return res.status(201).json({ industry: result.rows[0] });
    } catch (error) {
        return next(error);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const result = await db.query(
        `SELECT i.code, i.industry, ARRAY_AGG(ci.company_code) AS companies
        FROM industries i
        LEFT JOIN companies_industries ci ON i.code = ci.industry_code
        GROUP BY i.code, i.industry`);
        return res.json(result.rows);
    } catch (error) {
        return next(error);
    }
});

router.post("/:code/companies/:company_code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { company_code } = req.params;

        const result = await db.query(
            `INSERT INTO companies_industries (company_code, industry_code) 
             VALUES ($1, $2) 
             RETURNING company_code, industry_code`,
            [company_code, code]
          );
      
          return res.status(201).json({ association: result.rows[0] });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;