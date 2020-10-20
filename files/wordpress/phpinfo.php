<?php

phpinfo();

if (file_exists('/tmp/request_url_log.txt')) {
    print(file_get_contents('/tmp/request_url_log.txt'));
}