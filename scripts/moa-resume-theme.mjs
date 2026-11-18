// Reuse the archived classic resume's white paper, right portrait and quiet section rules.
export const legacyResumeCss = `
.sheet.resume{position:relative;width:210mm;height:297mm;padding:30px 32px 42px;background:#fff;color:#20262e;font-family:'Malgun Gothic','Apple SD Gothic Neo',Arial,sans-serif;word-break:keep-all;overflow-wrap:anywhere}
.sheet.resume>header,.sheet.resume>footer{display:flex;justify-content:space-between;align-items:center;color:#66717d;font-size:11px;line-height:1.4;letter-spacing:.025em}
.sheet.resume>header{border-bottom:1px solid #d6dbe1;padding-bottom:10px}
.sheet.resume>footer{position:absolute;left:32px;right:32px;bottom:20px;border-top:1px solid #d6dbe1;padding-top:10px}
.sheet.resume>header b,.sheet.resume>footer b{color:#a2aab3;font-weight:400;margin:0 7px}
.sheet.resume .page-content{padding-top:20px}
.sheet.resume .body{color:#4e5968;font-size:18px;line-height:1.6;max-width:none}
.sheet.resume p{color:#4e5968;margin:0 0 12px;font-size:18px;line-height:1.6}
.sheet.resume .body>p{font-size:18px;line-height:1.6;margin-bottom:12px}
.sheet.resume h1{color:#20262e;font-size:32px;font-weight:700;line-height:1.3;letter-spacing:-.035em;margin:0 0 18px;max-width:none}
.sheet.resume h2{color:#526071;font-size:16px;font-weight:700;line-height:1.4;letter-spacing:0;margin:20px 0 12px;padding-top:0;padding-bottom:8px;border-top:0;border-bottom:1px solid #cfd5dc}
.sheet.resume h3{color:#20262e;font-size:20px;font-weight:700;line-height:1.4;letter-spacing:-.025em;margin:0 0 8px}
.sheet.resume .body strong{color:#20262e;font-weight:700}
.sheet.resume a{color:#245f95;text-decoration:none}
.sheet.resume .profile-top{display:flex;flex-direction:row-reverse;justify-content:space-between;align-items:flex-start;gap:30px;margin:0 0 22px;padding-bottom:22px;border-bottom:1px solid #cfd5dc}
.sheet.resume .profile-top>div{flex:1;min-width:0}
.sheet.resume .profile-top h1{margin:0 0 8px;font-size:36px;line-height:1.2}
.sheet.resume .profile-top p{font-size:16px;line-height:1.6;margin:0 0 6px}
.sheet.resume .profile-top p:first-of-type{color:#526071;font-weight:600;margin-bottom:12px}
.sheet.resume .profile-top .portrait{width:96px;height:120px;object-fit:cover;flex:0 0 auto}
.sheet.resume .profile-top+h2{margin-top:0;color:#20262e;font-size:20px;border-bottom:0;padding-bottom:0;margin-bottom:8px}
.sheet.resume .profile-top+h2+p{color:#66717d;font-size:18px;margin-bottom:14px}
.sheet.resume .stack p{font-size:18px;line-height:1.6;margin:0}
.sheet.resume .stack strong{color:#20262e}
.sheet.resume .education{display:grid;grid-template-columns:1fr 1fr;gap:22px;color:#4e5968;font-size:18px;line-height:1.6}
.sheet.resume .education strong{font-size:18px;color:#20262e}
.sheet.resume .education p{font-size:18px;line-height:1.6;margin:6px 0 0}
.sheet.resume .experience{margin-top:10px;padding-top:8px;border-top:1px solid #dfe3e8;break-inside:avoid}
.sheet.resume .experience h3{color:#20262e;font-size:20px;line-height:1.4;margin:0 0 8px}
.sheet.resume .experience p{color:#4e5968;font-size:18px;line-height:1.6;margin:0}
`;
