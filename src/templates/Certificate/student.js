
export function StudentCertificate(studentName,courseName,branch,certificateName,description,duration,projectName="eflow"){
    let htmlContent = 
     `
     <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Achievement</title>
    <style>
        @page {
            size: A4 landscape; 
            margin: 0;
            padding:10px;
        }
        body {
            font-family: 'Georgia', serif;
            text-align: center;
            background: #f3f3f3;
            margin:0;
            padding:0;
        }
        .certificate-container {
            width: 297mm; 
            height: 205mm; 
            background: white;
            border: 15px solid gold;
            box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
            margin: auto;
            position: relative;
        }
        .certificate-header {
            font-size: 50px;
            font-weight: bold;
            color: #b89d00;
            margin-bottom: 10px;
        }
        .certificate-subtitle {
            font-size: 24px;
            font-style: italic;
            margin-bottom: 20px;
        }
        .certificate-body {
            font-size: 20px;
            margin: 20px 0;
        }
        .recipient-name {
            font-size: 28px;
            font-weight: bold;
            margin: 15px 0;
            text-decoration: underline;
            color: #333;
        }
        .course-name {
            font-size: 22px;
            font-weight: bold;
            color: #444;
        }
        .date {
            font-size: 18px;
            margin-top: 20px;
        }
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 200px;
        }
        .signature {
            width: 40%;
            text-align: center;
            border-top: 2px solid black;
            padding-top: 10px;
            font-size: 16px;
        }
        .gold-seal {
            position: absolute;
            bottom: 50px;
            right: 50px;
            width: 100px;
        }
        /* Print Styles */
        @media print {
            body {
                background: none;
            }
            .certificate-container {
                box-shadow: none;
                border: 10px solid gold;
            }
        }
    </style>
</head>
<body>

    <div class="certificate-container">
        <h1 class="certificate-header">Certificate of ${certificateName}</h1>
        <p class="certificate-subtitle">This is proudly presented to</p>
        <p class="recipient-name">${studentName}</p>
        <p class="certificate-body">For successfully completing the</p>
        <p class="course-name">${courseName}/${projectName}</p>
        <p class="certificate-body">${description}</p>
        <p class="certificate-body">on <strong>${duration} month</strong> program</p>
        
        <div class="signature-section">
            <div class="signature">Signature 1<br>Director</div>
            <div class="signature">Signature 2<br>Instructor</div>
        </div>

        <img class="gold-seal" src="https://upload.wikimedia.org/wikipedia/commons/e/e2/Gold_Seal.svg" alt="Gold Seal">
    </div>

</body>
</html>
     `

    return htmlContent
}