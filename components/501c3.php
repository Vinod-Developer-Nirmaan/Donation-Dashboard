<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function generatePDF($receipt_id, $fullname, $amount, $currency, $receipt_date, $cause, $address) {
	// create new PDF document
	$pdf = new TCPDF('P', 'mm', array('297', '210'), true, 'UTF-8', false);

	$pdf->setPrintFooter(false);
	$pdf->setPrintHeader(false);
	$pdf->SetMargins(PDF_MARGIN_LEFT - 0, PDF_MARGIN_TOP - 20, PDF_MARGIN_RIGHT - 0);

	// set auto page breaks
	$pdf->SetAutoPageBreak(FALSE, PDF_MARGIN_BOTTOM - 0);

	// set image scale factor
	// $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

	// set some language-dependent strings (optional)
	if (@file_exists(dirname(__FILE__) . '/lang/eng.php')) {
		require_once(dirname(__FILE__) . '/lang/eng.php');
		$pdf->setLanguageArray($l);
	}

	// set font
	$pdf->SetFont('helvetica', '', 10);

	$address = !empty($address) ? '<tr>
	<td style="line-height: 1.5;width:150px"><b>Donor\'s Address:</b></td>
	<td style="line-height: 1.5;border-bottom: 1px dashed #c4c4c4">' . $address . '</td>
	</tr>' : '<tr><td></td></tr>';

	// add a page
	$pdf->AddPage();

	// define some HTML content with style
	$html = <<<EOF
		<style>
			.border-10 {
				border: 5px solid #003C7A;
			}

			.h-center {
				text-align: center;
			}

			.v-center {
				display: flex;
				align-items: center;
			}

			.py-10 {
				padding-top: 10px;
				padding-bottom: 10px;
			}

			.px-20 {
				padding-left: 20px;
				padding-right: 20px;
			}

			.px-10 {
				padding-left: 10px;
				padding-right: 10px;
			}

			.my-5 {
				padding-top: 5px;
				padding-bottom: 5px;
			}
			.my-10 {
				padding-top: 10px;
				padding-bottom: 10px;
			}

			.my-30 {
				padding-top: 30px;
				padding-bottom: 30px;
			}

			.mx-20 {
				padding-left: 20px;
				padding-right: 20px;
			}

			.paragraph {
				font-size: 12px;
				font-family: Arial, Helvetica, sans-serif;
			}

			.f-between {
				display: flex;
				justify-content: space-between;
			}

			.container {
				margin-left: 100px;
				margin-right: 100px;
			}

			.w-headings {
				width: 250px;
			}

			.inline-block {
				display: inline-block;
			}

			.p-10 {
				padding: 10px;
			}

			.border-bottom {
				border-bottom: 1px solid #003C7A;
			}

			.max-w-100 {
				max-width: 100%;
			}

			.w-65p {
				width: 70%;
			}

			.w-25p {
				width: 25%;
			}

			.h-right {
				display: flex;
				justify-content: flex-end
			}
			.headings{
				font-size: 15px;
			}
			.details{
				font-size: 12px;
			}
		</style>
		<div>
			<table cellspacing="10" cellpadding="0">
				<tr>
					<th>
					<div class=""><img src="imgs/logo.png" width="150px" /></div>
						<table border="0" cellspacing="0" cellpadding="0">
							<tr class="paragraph">
								<td align="left">
								<table style="border-spacing: 0px 5px;">
								<tr><td><b>Name of Organization: </b>Nirmaan USA</td></tr>
								<tr><td><b>Address: </b>7 Tralee Ct Bloomington IL 61704</td></tr>
								<tr><td><b>EIN: </b> 85-2571471</td></tr>
								</table>
								</td>
								<td align="right"></td>
							</tr>
						</table>
						
						<br/>
						
						<table border="0" cellspacing="5" cellpadding="0">
							<tr>
								<td align="left" class="paragraph"><br/><br/>Dear $fullname,<br/><br/>
								Thank you. Nirmaan USA is very grateful for your generous gift of <b>&#36;$amount $currency</b> on <b>$receipt_date</b> for <b>$cause</b>.<br/><br/>
								Please see below for a copy of your tax receipt information for your donation.<br/><br/>
								The humanitarian efforts of Nirmaan USA provide comfort and hope to so many during their times of need. Thank you for your commitment to this critically important work. Our mission depends on the support and compassion of donors like you.<br/><br/>
								On behalf of those we serve, thank you for standing with us.<br/><br/>
								Sincerely,<br/>Mayur Patnala (Founder & CEO), <br/>Nirmaan Organization<br/><hr/>
								<b><br/><br/>Please print this page for tax purposes:</b><br/><br/>
								As required by IRS regulations, we provide the following information: Nirmaan USA is a 501(c)(3) not for profit organization. Our federal tax identification number is 85-2571471. As no goods or services have been provided in connection with this gift, the full amount is deductible to the fullest extent provided by law.
								<br/><br/></td>
							</tr>
						</table>
						<table border="0" cellspacing="0" cellpadding="0">
							<tr class="paragraph">
								<td align="left">
								<table style="border-spacing: 0px 5px;">
								<tr><td><b>Donation: </b>&nbsp;&#36;$amount $currency</td></tr>
								<tr><td><b>Date: </b>&nbsp;$receipt_date</td></tr>
								<tr><td><b>Transaction ID: </b>&nbsp;$receipt_id</td></tr>
								</table>
								</td>
								<td align="right"></td>
							</tr>
						</table>
					</th>
				</tr>
			</table>
		</div>
EOF;
	// output the HTML content
	$pdf->writeHTML($html, true, false, true, false, '');

	// reset pointer to the last page
	$pdf->lastPage();
    $directory = 'receipts';
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $filepath = "$directory/$receipt_id.pdf";
    ob_clean();
    $pdf->Output($_SERVER['DOCUMENT_ROOT'] . $filepath, 'F');

    return $filepath;
	/*
	$filepath = 'receipts/' . $receipt_id . '.pdf';
	ob_clean();
	$pdf->Output($filepath, 'F');
	// $receipt_data = chunk_split($receipt);
	return $filepath;*/
}

function getEmailBody($variables, $cause, $reference) {
    $templateFile = '';
	if(($cause=='Gift a Childhood' || $cause=='Udaan Library 2025' || $cause=='Empower a Mother') && $reference=='support-rajeev-tummala-charity-challenge'){
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
        $mail->Body    = getEmailBody($variables, $cause, $reference);
        $mail->AltBody = "Hello, " . $variables['fullname'] . "!\nThank you for your generous donation of USD " . $variables['amount'] . " on " . $variables['receipt_date'] . ".\n\nBest regards,\nNirmaan Organization";

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
    'email' => $email
];

$filepath = generatePDF($receipt_id, $fullname, $amount, $currency, $receipt_date, $cause, $address);

if (file_exists($filepath)) {
    sendEmail($filepath, $email, $variables, $cause);
}

/*
if ($cause=="Backpacks for Dreams 2025") {
    require('templates/btswatemplate.php');
}
else if($cause!='Rotary Campaign Against Hunger' && $cause!='Gift a Childhood'){
    require('templates/generalwatemplate.php');
}*/
?>