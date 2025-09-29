package com.banking.transaction.application.dto;

import java.util.List;

public class AccountStatementReportResponse {
    private List<AccountStatementDTO> reportData;
    private String pdfBase64;

    public AccountStatementReportResponse() {
    }

    public AccountStatementReportResponse(List<AccountStatementDTO> reportData, String pdfBase64) {
        this.reportData = reportData;
        this.pdfBase64 = pdfBase64;
    }

    public List<AccountStatementDTO> getReportData() {
        return reportData;
    }

    public void setReportData(List<AccountStatementDTO> reportData) {
        this.reportData = reportData;
    }

    public String getPdfBase64() {
        return pdfBase64;
    }

    public void setPdfBase64(String pdfBase64) {
        this.pdfBase64 = pdfBase64;
    }
}