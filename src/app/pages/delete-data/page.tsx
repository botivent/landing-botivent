import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Eliminación de Datos",
  description: "Política de eliminación de datos de Botivent",
}

export default function DeleteDataPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Eliminación de Datos</h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-muted-foreground mb-6">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Derecho a la Eliminación</h2>
            <p className="text-muted-foreground mb-4">
              Bajo el Reglamento General de Protección de Datos (RGPD) y otras leyes de privacidad aplicables, 
              usted tiene derecho a solicitar la eliminación de sus datos personales. Esta política describe 
              cómo procesamos estas solicitudes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Cuándo Podemos Eliminar sus Datos</h2>
            <p className="text-muted-foreground mb-4">
              Eliminaremos sus datos personales cuando:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Los datos ya no sean necesarios para el propósito original</li>
              <li>Usted retire su consentimiento y no haya otra base legal</li>
              <li>Los datos hayan sido procesados de manera ilegal</li>
              <li>Los datos deban eliminarse para cumplir con una obligación legal</li>
              <li>Usted se oponga al procesamiento y no haya intereses legítimos prevalentes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Cuándo NO Podemos Eliminar sus Datos</h2>
            <p className="text-muted-foreground mb-4">
              Podemos rechazar una solicitud de eliminación cuando:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>El ejercicio de la libertad de expresión e información</li>
              <li>El cumplimiento de una obligación legal</li>
              <li>Razones de interés público en el ámbito de la salud pública</li>
              <li>Fines de investigación científica o histórica o fines estadísticos</li>
              <li>El establecimiento, ejercicio o defensa de reclamaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Proceso de Solicitud</h2>
            <p className="text-muted-foreground mb-4">
              Para solicitar la eliminación de sus datos:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground mb-4">
              <li>Envíe una solicitud por escrito a privacy@botivent.com</li>
              <li>Incluya su nombre completo y dirección de correo electrónico</li>
              <li>Especifique qué datos desea eliminar</li>
              <li>Proporcione una copia de su identificación para verificar su identidad</li>
            </ol>
            <p className="text-muted-foreground mb-4">
              Responderemos a su solicitud dentro de 30 días.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Verificación de Identidad</h2>
            <p className="text-muted-foreground mb-4">
              Para proteger su privacidad, debemos verificar su identidad antes de procesar cualquier 
              solicitud de eliminación. Esto puede incluir:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Solicitar una copia de su documento de identidad</li>
              <li>Confirmar información específica de su cuenta</li>
              <li>Verificar su dirección de correo electrónico</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Datos que se Eliminan</h2>
            <p className="text-muted-foreground mb-4">
              Cuando procesamos una solicitud de eliminación, eliminamos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Información de la cuenta de usuario</li>
              <li>Datos de perfil personal</li>
              <li>Historial de conversaciones</li>
              <li>Datos de facturación (según la legislación aplicable)</li>
              <li>Preferencias y configuraciones</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Datos que se Conservan</h2>
            <p className="text-muted-foreground mb-4">
              Algunos datos pueden conservarse por razones legales o técnicas:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Registros de transacciones financieras (según la legislación fiscal)</li>
              <li>Logs de seguridad y auditoría</li>
              <li>Datos anonimizados para análisis</li>
              <li>Información requerida por autoridades legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Tiempo de Procesamiento</h2>
            <p className="text-muted-foreground mb-4">
              Procesamos las solicitudes de eliminación dentro de 30 días calendario. 
              Si necesitamos más tiempo debido a la complejidad de la solicitud, 
              le notificaremos y explicaremos el retraso.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Confirmación de Eliminación</h2>
            <p className="text-muted-foreground mb-4">
              Una vez completada la eliminación, le enviaremos una confirmación por correo electrónico 
              detallando qué datos se han eliminado y cuáles se han conservado (si los hay) y por qué.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Derecho de Reclamación</h2>
            <p className="text-muted-foreground mb-4">
              Si no está satisfecho con nuestra respuesta a su solicitud de eliminación, 
              tiene derecho a presentar una reclamación ante la autoridad de protección de datos 
              de su jurisdicción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Para solicitar la eliminación de sus datos o para cualquier pregunta sobre esta política:
            </p>
            <p className="text-muted-foreground">
              Email: privacy@botivent.com<br />
              Asunto: "Solicitud de Eliminación de Datos"
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
