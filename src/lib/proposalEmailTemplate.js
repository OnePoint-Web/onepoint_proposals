export function buildProposalEmailHtml(firstName, lastName, proposalTitle, viewLink, credentials, isTest = false) {
    const testBanner = isTest ? `
                        <tr>
                            <td style="background:#FFF3CD;border-bottom:1px solid #FFE69C;padding:12px 40px;text-align:center;">
                                <p style="color:#664D03;font-size:13px;font-weight:bold;margin:0;letter-spacing:0.02em;">
                                    ⚠ TEST EMAIL — this is not an actual proposal send
                                </p>
                            </td>
                        </tr>` : ''

    const credentialsBlock = credentials ? `
                                <table cellpadding="0" cellspacing="0" width="100%" style="background:#F8F9FC;border-radius:8px;margin:0 0 32px;">
                                    <tr>
                                        <td style="padding:20px 24px;">
                                            <p style="color:#1A1A2E;font-size:14px;font-weight:bold;margin:0 0 12px;">Your Client Portal Login</p>
                                            <p style="color:#4A5568;font-size:14px;margin:0 0 4px;">Username: <strong>${credentials.username}</strong></p>
                                            <p style="color:#4A5568;font-size:14px;margin:0;">Password: <strong>${credentials.password}</strong></p>
                                        </td>
                                    </tr>
                                </table>` : ''

    return `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                        ${testBanner}
                        <tr>
                            <td style="background:#1A1A2E;padding:28px 40px;text-align:center;">
                                <span style="color:#F22044;font-weight:bold;font-size:22px;letter-spacing:1px;">OnePoint</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:40px;">
                                <p style="color:#1A202C;font-size:16px;margin:0 0 12px;">Dear ${firstName} ${lastName},</p>
                                <p style="color:#4A5568;font-size:15px;line-height:1.6;margin:0 0 20px;">
                                    We are pleased to share the following proposal with you:
                                </p>
                                <p style="color:#1A1A2E;font-size:18px;font-weight:bold;margin:0 0 28px;">
                                    ${proposalTitle}
                                </p>
                                <p style="color:#4A5568;font-size:15px;line-height:1.6;margin:0 0 32px;">
                                    Click the button below to view your proposal. This link is unique to you and will expire in 30 days.
                                </p>
                                <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                                    <tr>
                                        <td style="background:#F22044;border-radius:8px;padding:14px 32px;">
                                            <a href="${viewLink}" style="color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none;display:block;">
                                                View Proposal
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="color:#718096;font-size:13px;margin:0 0 4px;">
                                    If the button above does not work, copy and paste this link into your browser:
                                </p>
                                <p style="color:#F22044;font-size:13px;margin:0 0 32px;word-break:break-all;">${viewLink}</p>
                                ${credentialsBlock}
                                <p style="color:#4A5568;font-size:14px;margin:0;">
                                    Regards,<br/><strong>OnePoint IT</strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background:#F8F9FC;padding:20px 40px;text-align:center;">
                                <p style="color:#A0AEC0;font-size:12px;margin:0;">
                                    © ${new Date().getFullYear()} OnePoint IT. This email and link are intended only for the named recipient.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
    `
}
