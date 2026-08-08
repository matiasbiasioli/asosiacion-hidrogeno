<?php
/**
 * AAH — contacto.php
 * -----------------------------------------------------------
 * Recibe el POST del formulario de contacto (index.html #contacto),
 * valida los campos y envía el email. Responde en JSON para que
 * home.js pueda mostrar el mensaje de éxito/error sin recargar la página.
 *
 * IMPORTANTE: esto necesita un hosting con PHP real (cPanel, Hostinger, etc.).
 * NO funciona abriendo el sitio con Live Server / file:// — para probarlo
 * hay que subirlo al hosting, o correr un servidor PHP local (ej: XAMPP,
 * o `php -S localhost:8000` desde esta carpeta).
 */

header('Content-Type: application/json; charset=utf-8');

// --- Solo aceptar POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido.']);
    exit;
}

// --- Recibir y limpiar los campos ---
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$website = trim($_POST['website'] ?? ''); // honeypot anti-spam (ver nota abajo)

// --- Honeypot: campo oculto que un humano nunca completa ---
// Si vino con contenido, es casi seguro un bot. Respondemos "éxito"
// para no darle pistas, pero no enviamos ningún email.
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// --- Validación de campos obligatorios ---
if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Faltan campos obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'El email no es válido.']);
    exit;
}

// Límite razonable de largo, por las dudas
if (mb_strlen($name) > 150 || mb_strlen($message) > 5000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'El mensaje es demasiado largo.']);
    exit;
}

// --- Destino del email ---
// TODO: confirmar si este es el mail definitivo del cliente para recibir consultas.
$destinatario = 'aahidrogeno@gmail.com';

$asunto = 'Nuevo mensaje contacto — Web AAH';

$cuerpo  = "Nombre: {$name}\n";
$cuerpo .= "Email: {$email}\n\n";
$cuerpo .= "Mensaje:\n{$message}\n";

// --- Cabeceras ---
// OJO: muchos hostings (incluido Hostinger) marcan como spam los mails
// donde el "From" no pertenece al mismo dominio del sitio. Reemplazar
// "noreply@TUDOMINIO.com" por un mail real del dominio de la AAH una
// vez que esté el hosting definitivo.
$headers   = [];
$headers[] = 'From: Formulario Web AAH <noreply@TUDOMINIO.com>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// --- Envío ---
$enviado = mail($destinatario, $asunto, $cuerpo, implode("\r\n", $headers));

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'No se pudo enviar el mensaje. Intentá nuevamente más tarde.']);
}