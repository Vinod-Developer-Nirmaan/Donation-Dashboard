<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function generatePDF($receipt_id, $fullname, $amount, $currency, $receipt_date, $cause, $address, $pan, $email, $financial_year) {
    $pdf = new TCPDF('P', 'mm', array('297', '210'), true, 'UTF-8', false);
    $pdf->setPrintFooter(false);
    $pdf->setPrintHeader(false);
    $pdf->SetMargins(PDF_MARGIN_LEFT - 0, PDF_MARGIN_TOP - 20, PDF_MARGIN_RIGHT - 0);
    $pdf->SetAutoPageBreak(FALSE, PDF_MARGIN_BOTTOM - 0);
    $pdf->SetFont('helvetica', '', 10);
    $pdf->AddPage();

    if (empty($pan)) {
        $pan = "-";
    }

    $html = <<<EOF
    <style>
        .border-10 { border: 5px solid #003C7A; }
        .h-center { text-align: center; }
        .v-center { display: flex; align-items: center; }
        .py-10 { padding-top: 10px; padding-bottom: 10px; }
        .px-20 { padding-left: 20px; padding-right: 20px; }
        .px-10 { padding-left: 10px; padding-right: 10px; }
        .my-5 { padding-top: 5px; padding-bottom: 5px; }
        .my-10 { padding-top: 10px; padding-bottom: 10px; }
        .my-30 { padding-top: 30px; padding-bottom: 30px; }
        .mx-20 { padding-left: 20px; padding-right: 20px; }
        .paragraph { font-size: 12px; font-family: Arial, Helvetica, sans-serif; }
        .f-between { display: flex; justify-content: space-between; }
        .container { margin-left: 100px; margin-right: 100px; }
        .w-headings { width: 250px; }
        .inline-block { display: inline-block; }
        .p-10 { padding: 10px; }
        .border-bottom { border-bottom: 1px solid #003C7A; }
        .max-w-100 { max-width: 100%; }
        .w-65p { width: 70%; }
        .w-25p { width: 25%; }
        .h-right { display: flex; justify-content: flex-end; }
        .headings { font-size: 15px; }
        .details { font-size: 12px; }
        .f-small { font-size: 9px; }
        .f-medium { font-size: 11px; }
        .border { border: 1px solid #ccc; }
        .text-gray { color: #525252; }
        .text-nirmaan { color: #003c7a; }
        @media print { .mb-5 { margin-bottom: 15px; } }
        .h-10 { height: 10px; }
    </style>
    <div>
        <table cellspacing="5">
            <tr>
                <td align="left"><img src="imgs/logo.png" width="120px" /></td>
                <td align="right" colspan="2">
                    <table cellspacing="4">
                        <tr><td></td></tr>
                        <tr><td><b>Address: </b><span class="text-gray">&nbsp;Nirmaan Organization, H.No. 1-98/9/3,</span></td></tr>
                        <tr><td><span class="text-gray">Jaihind Enclave, Madhapur, Hyderabad - 500081</span></td></tr>
                        <tr><td><b>Email: </b><span class="text-gray">&nbsp;contact@nirmaan.org</span></td></tr>
                    </table>
                </td>
            </tr>
            <tr><td><br/></td></tr>
            <tr>
                <td colspan="3"><br/><br/><span class="paragraph" style="font-size: 13px; font-weight: bold;">Dear $fullname,</span><br/><br/>
                <span class="text-gray f-medium">Thank you, Nirmaan Organization is very grateful for your generous donation of <b class="text-nirmaan">$amount $currency</b> on <b class="text-nirmaan">$receipt_date</b> for <b class="text-nirmaan">$cause</b>.</span>
                </td>
            </tr>
        </table>
        <table cellspacing="5">
            <tr>
                <td colspan="3" style="text-align: justify;">
                <br/>
                <span class="text-gray f-medium">The humanitarian efforts of Nirmaan Organization provide comfort and hope to so many during their times of need. Thank you for your commitment to this critically important work. Our mission depends on the support and compassion of donors like you. On behalf of those we serve, thank you for standing with us.</span><br/><br/>
                <b>Sincerely,</b><br/><span class="text-gray">Mayur Patnala (Founder & CEO), <br/>Nirmaan Organization.</span><br/>
                </td>
            </tr>
            <tr><td colspan="3"><hr/></td></tr>
        </table>
        <table cellspacing="5">
            <tr>
                <td>
                    <h3>Organization details:</h3><br/><br/>
                    <b>PAN:</b><br/>
                    <span class="text-gray">AAAAN5250A</span><br/><br/>
                    <b class="mb-5">Registered Address:</b><br/>
                    <span class="text-gray">H.No. 1-98/9/3, Jaihind Enclave, Madhapur, Hyderabad - 500081</span><br/><br/>
                    <b>80g:</b><br/>
                    <span class="text-gray">80G-AAAAN5250AF20214 dated 28-05-2021 issued 11-Clause (i) of first proviso to sub-section (5) of section 80G</span><br/><br/>
                    <b>12A:</b><br/>
                    <span class="text-gray">12A-AAAAN5250AE20214 dated 28-05-2021 issued 01-Sub clause (i) of clause (ac) of sub -section (1) of section 12A</span><br/>
                </td>
                <td>
                    <h3>Donor details:</h3><br/><br/>
                    <b>Name:</b><br/>
                    <span class="text-gray">$fullname</span><br/><br/>
                    <b>Address:</b><br/>
                    <span class="text-gray">$address</span><br/><br/>
                    <b>PAN:</b><br/>
                    <span class="text-gray">$pan</span><br/><br/>
                    <b>Email:</b><br/>
                    <span class="text-gray">$email</span><br/><br/>
                    <b>Date & Financial Year:</b><br/>
                    <span class="text-gray">$receipt_date ($financial_year)</span><br/>
                </td>
            </tr>
        </table>
        <table cellspacing="5">
            <tr><td colspan="2"><hr/></td></tr>
            <tr><td colspan="2"><h3>Donation Details:</h3></td></tr>
            <tr><td><b>Receipt ID: </b><br/><span class="text-gray">$receipt_id</span></td>
                <td><b>Amount: </b><br/><span class="text-gray">$amount $currency</span></td></tr>
            <tr><td colspan="2"><hr/></td></tr>
            <tr><td colspan="2" align="center" style="text-align:center;"><span class="text-gray" style="font-size:10px;">This receipt is system generated and no signature is required.</span></td></tr>
        </table>
    </div>
EOF;

    $pdf->writeHTML($html, true, false, true, false, '');

    $directory = 'receipts';
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
    if($cause=='Miles for Mind')
         $filepath = "$directory/experian-run-2025/$receipt_id.pdf";
     else  
        $filepath = "$directory/$receipt_id.pdf";
    ob_clean();
    $pdf->Output($_SERVER['DOCUMENT_ROOT'] . $filepath, 'F');

    return $filepath;
}

function getEmailBody($variables, $cause) {
    $templateFile = '';

    // Select the appropriate template file based on the cause
    if(($cause=='Gift a Childhood' || $cause=='Udaan Library 2025' || $cause=='Empower a Mother') && $variables['reference']=='support-rajeev-tummala-charity-challenge'){
		$templateFile = 'templates/rajeev-tummala.html';
	}
	else if($cause=='Himalayan Clouds Challenge'){
		$templateFile = 'templates/rajeev-tummala-generic.html';
	}
	else if($cause=='Gift a Childhood'){
		$templateFile = 'templates/gift-a-childhood-template.html';
	}
	else if($cause=='Youth Skill Development'){
		$templateFile = 'templates/ysd-template.html';
	}
	else if($cause=='Backpacks for Dreams 2025'){
		$templateFile = 'templates/btstemplate.html';
	}
	else if($cause=='Support Rural Dreams at Spoorthy Bhavan'){
	    $templateFile = 'templates/spoorthy-bhavan.html';
	}
	else if($cause=='Miles for Mind'){
	    $templateFile = 'templates/experian-run-2025.html';
	}
	else{
		$templateFile = 'templates/default-email-template.html';
	}

    if (!file_exists($templateFile)) {
        return 'Template not found';
    }

    $template = file_get_contents($templateFile);
    foreach ($variables as $key => $value) {
        $template = str_replace('{{' . $key . '}}', $value, $template);
    }
    return $template;
}

function sendEmail($filepath, $email, $variables, $cause) {
    $mail = new PHPMailer(true);

    try {
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'transactions@nirmaan.org';
        $mail->Password   = 'stwkrqyqrvcvtxfu'; // Add SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;

        //Recipients
        $mail->setFrom('transactions@nirmaan.org', 'Nirmaan Organization');
        $mail->addAddress(trim($email));

        //Attachments
        $mail->addAttachment($filepath);

        //Content
        $mail->isHTML(true);
        $mail->Subject = 'Thank You for Your Donation to Nirmaan: Donation Receipt Enclosed!';
        $mail->Body    = getEmailBody($variables, $cause);
        $mail->AltBody = 'Hello, ' . $variables['fullname'] . '!\nThank you for your generous donation of INR ' . $variables['amount'] . ' on ' . $variables['receipt_date'] . '.\n\nBest regards,\nNirmaan Organization';

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}

$variables = [
    'fullname' => $fullname,
    'amount' => $amount,
    'currency' => $currency,
    'receipt_date' => $receipt_date,
    'receipt_id' => $receipt_id,
    'cause' => $cause,
    'address' => $address,
    'pan' => $pan,
    'email' => $email,
    'financial_year' => $financial_year,
    'mobile' => $mobile,
    'reference' => $reference
];

$filepath = generatePDF($receipt_id, $fullname, $amount, $currency, $receipt_date, $cause, $address, $pan, $email, $financial_year);

if (file_exists($filepath)) {
    sendEmail($filepath, $email, $variables, $cause);
}

if ($cause=="Backpacks for Dreams 2025") {
    require('templates/btswatemplate.php');
}
else if($cause=='Support Rural Dreams at Spoorthy Bhavan'){
    require('templates/sbwatemplate.php');
}
else if($cause!='Rotary Campaign Against Hunger' && $cause!='Miles for Mind' && $cause!='Gift a Childhood'){
    require('templates/generalwatemplate.php');
}
?>