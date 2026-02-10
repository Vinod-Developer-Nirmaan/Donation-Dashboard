<?php
if(!empty($mobile) && !empty($receipt_id) && !empty($amount) && !empty($currency) && !empty($fullname)){
    $filtered_mobile = str_replace("+", "", $mobile);
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode(array(
            "integrated_number" => "17756444448",
            "content_type" => "template",
            "payload" => array(
                "messaging_product" => "whatsapp",
                "type" => "template",
                "template" => array(
                    "name" => "spoorthybhavan_thankyou",
                    "language" => array(
                        "code" => "en",
                        "policy" => "deterministic"
                    ),
                    "namespace" => "6b0ede78_6b13_4df1_a682_4405f5af95fa",
                    "to_and_components" => array(
                        array(
                            "to" => array($filtered_mobile),
                            "components" => array(
                                "header_1" => array(
                                    "type" => "image",
                                    "value" => "https://nirmaan.org/assets/img/emails/SB_Thankyou_Banner_WA.jpeg"
                                ),
                                "body_1" => array(
                                    "type" => "text",
                                    "value" => $fullname
                                ),
                                "body_2" => array(
                                    "type" => "text",
                                    "value" => $amount
                                ),
                                "body_3" => array(
                                    "type" => "text",
                                    "value" => $currency
                                ),
								"body_4" => array(
                                    "type" => "text",
                                    "value" => $receipt_id
                                )
                            )
                        )
                    )
                )
            )
        )),
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'authkey: 387001AB2NM0xJS66585d0cP1',
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
}
?>