<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require('../inc/core.php');
require '../../vendor/autoload.php';

$number_to_word = new NumberFormatter("en_GB", NumberFormatter::SPELLOUT);
$timestamp_now = time();
$core = new Core();
$db = $core->dbcon;
$request = new \stdClass();
if (isset($_POST)) {
    $json = file_get_contents('php://input');
    $data = json_decode($json);
    $id = $data->id ?? '';
    mkdir("receipts/" . $timestamp_now);

    if (!empty($id)) {
        $response = $db->get('payments', "*", "PaymentId=$id");
        $serial_no = "";
        $fullname = $response['FullName'];
        $amount = $response['Amount'];
        $cause = $response['Cause'];
        $email = $response['Email'];
        $mobile = $response['Mobile'];
        $address = $response['Address'];
        $pan = $response['Pan'];
        $zip = $response['Zip'];
        $payment_date = $response['PaymentDate'];
        $receipt_id = $response['ReceiptId'];
        $receipt_date = date('d-M-Y', strtotime($payment_date));
        if ($currency === 'INR') {
            $currency = 'INR';
            $amount_in_words = ucfirst($number_to_word->format($amount));
        } else {
            $currency = $response['Currency'];
        }
        $financial_year = date('m', strtotime($payment_date)) > 3 ? date('Y', strtotime($payment_date)) . '-' . (date('Y', strtotime($payment_date)) + 1) : (date('Y', strtotime($payment_date)) - 1) . "-" . date('Y', strtotime($payment_date));

        $filepath = dirname(__FILE__) . '/receipts/' . $timestamp_now . '/' . $receipt_id . '.pdf';
        if ($currency === 'INR') {
            include('80g.php');
        } else {
            include('501c3.php');
        }

        if (file_exists($filepath) && !empty($email)) {
            $mail = new PHPMailer(true);

            //Server settings
            $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
            $mail->isSMTP();                                            //Send using SMTP
            $mail->Host       = 'nirmaanapps.in';                     //Set the SMTP server to send through
            $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $mail->Username   = 'test@nirmaanapps.in';                     //SMTP username
            $mail->Password   = 'qwerty11.';                               //SMTP password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

            //Recipients
            $mail->setFrom('test@nirmaanapps.in', 'Nirmaan Organization');    //Add a recipient
            $mail->addAddress(trim($email));               //Name is optional

            //Attachments
            $mail->addAttachment($filepath);         //Add attachments

            //Content
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->Subject = 'E-Receipt for your donation to Nirmaan';
            $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
            $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

            $mail->send();

            $request->meta = [
                "error" => false,
                "message" => 'Email successfully sent'
            ];
        } else{
            $request->meta = [
                "error" => true,
                "message" => 'Mail is missing'
            ];
        }
    } else {
        $request->meta = [
            "error" => true,
            "message" => 'Fields are missing'
        ];
    }
}
echo json_encode($request);
