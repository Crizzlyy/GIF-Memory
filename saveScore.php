<?php
    $json_str = file_get_contents( 'scores.json' );
    $json_arr = json_decode( $json_str, true );

    if( !$json_arr ) {
        $json_arr = array();
    }

    $json_arr[] = $_POST;
    $json_str_done = json_encode( $json_arr );
    file_put_contents( 'scores.json', $json_str_done );
?>