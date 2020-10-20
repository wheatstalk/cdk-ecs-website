<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

function map_env_to_secret_field($env) {
    switch ($env) {
        case 'WORDPRESS_DB_NAME': return 'dbname';
        case 'WORDPRESS_DB_USER': return 'username';
        case 'WORDPRESS_DB_PASSWORD': return 'password';
        case 'WORDPRESS_DB_HOST': return 'host';
        default: return null;
    }
}

/**
 * Gets a deployment setting if it's defined or the default.
 *
 * @param string $name
 * @param string $default
 * @return string value of the environment variable by name or default
 */
function get_deployment_setting($name, $default = null) {
    if (isset($_ENV[$name])) {
        return $_ENV[$name];
    }

    if (isset($_ENV['WORDPRESS_DB_SECRET'])) {
        $json = json_decode($_ENV['WORDPRESS_DB_SECRET'], true);
        $env_to_field = map_env_to_secret_field($name);

        if (isset($json) && isset($env_to_field) && isset($json[$env_to_field])) {
            return $json[$env_to_field];
        }
    }

    return $default;
}


if (isset($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
    // Define the site url & home as whatever the user requested which made it
    // through the load balancer rules.
    $request_url = "{$_SERVER['HTTP_X_FORWARDED_PROTO']}://{$_SERVER['HTTP_HOST']}/";
    define('WP_SITEURL', $request_url);
    define('WP_HOME', $request_url);
} else {
    // When there's no x-forwarded-for, we're probably handling a load balancer
    // health check.
    $request_url = "{$_SERVER['REQUEST_SCHEME']}://{$_SERVER['HTTP_HOST']}/";
    define('WP_SITEURL', $request_url);
    define('WP_HOME', $request_url);
}

// Disable UI-based plugin and theme installs/updates. This deployment scheme
// expects that the site's code is fixed.
define('DISALLOW_FILE_MODS', true);

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', get_deployment_setting('WORDPRESS_DB_NAME', 'wordpress'));

/** MySQL database username */
define( 'DB_USER', get_deployment_setting('WORDPRESS_DB_USER'));

/** MySQL database password */
define( 'DB_PASSWORD', get_deployment_setting('WORDPRESS_DB_PASSWORD'));

/** MySQL hostname */
define( 'DB_HOST', get_deployment_setting('WORDPRESS_DB_HOST'));

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', get_deployment_setting('WORDPRESS_DB_CHARSET', 'utf8'));

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', get_deployment_setting('WORDPRESS_DB_COLLATE', ''));

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */

define( 'DEFAULT_SALT',     'put your unique phrase here');
define( 'AUTH_KEY',         get_deployment_setting('AUTH_KEY', DEFAULT_SALT));
define( 'SECURE_AUTH_KEY',  get_deployment_setting('SECURE_AUTH_KEY', DEFAULT_SALT));
define( 'LOGGED_IN_KEY',    get_deployment_setting('LOGGED_IN_KEY', DEFAULT_SALT));
define( 'NONCE_KEY',        get_deployment_setting('NONCE_KEY', DEFAULT_SALT));
define( 'AUTH_SALT',        get_deployment_setting('AUTH_SALT', DEFAULT_SALT));
define( 'SECURE_AUTH_SALT', get_deployment_setting('SECURE_AUTH_SALT', DEFAULT_SALT));
define( 'LOGGED_IN_SALT',   get_deployment_setting('LOGGED_IN_SALT', DEFAULT_SALT));
define( 'NONCE_SALT',       get_deployment_setting('NONCE_SALT', DEFAULT_SALT));

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = get_deployment_setting('WORDPRESS_TABLE_PREFIX', 'wp_');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', get_deployment_setting('WORDPRESS_DEBUG', 'false') == 'true');

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . 'wp-config.php/');
}

if (file_exists(ABSPATH . 'wp-config-salt.php')) {
    require_once ABSPATH . 'wp-config-salt.php';
}

if (file_exists(ABSPATH . 'wp-config-local.php')) {
    require_once ABSPATH . 'wp-config-local.php';
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
