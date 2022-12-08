// W3 table css
// https://www.w3schools.com/css/css_table.asp
export const getTableStyle = (selector = "table") => `
${selector} {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
}
${selector} td, ${selector} th {
    border: 1px solid #ddd;
    padding: 8px;
}
${selector} tr:nth-child(even){ background-color: #f2f2f2; }
${selector} tr:hover { background-color: #ddd; }
${selector} th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: #04AA6D;
    color: white;
}`;
