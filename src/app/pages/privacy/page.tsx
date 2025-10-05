import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Botivent",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-muted-foreground mb-6">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Información que Recopilamos</h2>
            <p className="text-muted-foreground mb-4">
              Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, 
              utiliza nuestros servicios o se comunica con nosotros. Esta información puede incluir:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Nombre y dirección de correo electrónico</li>
              <li>Información de facturación</li>
              <li>Contenido de los mensajes y conversaciones</li>
              <li>Datos de uso de la plataforma</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Cómo Utilizamos su Información</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Procesar pagos y transacciones</li>
              <li>Comunicarnos con usted sobre el servicio</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Prevenir fraudes y garantizar la seguridad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Compartir Información</h2>
            <p className="text-muted-foreground mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Con su consentimiento explícito</li>
              <li>Para cumplir con obligaciones legales</li>
              <li>Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de confidencialidad)</li>
              <li>En caso de fusión, adquisición o venta de activos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Seguridad de los Datos</h2>
            <p className="text-muted-foreground mb-4">
              Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información 
              contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Cifrado de datos en tránsito y en reposo</li>
              <li>Acceso restringido a la información personal</li>
              <li>Monitoreo regular de nuestros sistemas</li>
              <li>Capacitación del personal en privacidad y seguridad</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Sus Derechos</h2>
            <p className="text-muted-foreground mb-4">
              Bajo el RGPD y otras leyes de privacidad aplicables, usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Acceder a sus datos personales</li>
              <li>Rectificar información inexacta</li>
              <li>Solicitar la eliminación de sus datos</li>
              <li>Limitar el procesamiento de sus datos</li>
              <li>Portabilidad de datos</li>
              <li>Oponerse al procesamiento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies y Tecnologías Similares</h2>
            <p className="text-muted-foreground mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia, analizar el uso del sitio 
              y personalizar el contenido. Puede controlar las cookies a través de la configuración de su navegador.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Retención de Datos</h2>
            <p className="text-muted-foreground mb-4">
              Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos 
              descritos en esta política, a menos que la ley requiera un período de retención más largo.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Transferencias Internacionales</h2>
            <p className="text-muted-foreground mb-4">
              Sus datos pueden ser transferidos y procesados en países fuera de su jurisdicción. 
              Nos aseguramos de que dichas transferencias cumplan con las leyes de protección de datos aplicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Menores de Edad</h2>
            <p className="text-muted-foreground mb-4">
              Nuestros servicios no están dirigidos a menores de 16 años. No recopilamos conscientemente 
              información personal de menores de 16 años sin el consentimiento de los padres.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Cambios a esta Política</h2>
            <p className="text-muted-foreground mb-4">
              Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios 
              significativos publicando la nueva política en esta página.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Si tiene preguntas sobre esta política de privacidad o desea ejercer sus derechos, contacte con nosotros:
            </p>
            <p className="text-muted-foreground">
              Email: privacy@botivent.com<br />
              Delegado de Protección de Datos: dpo@botivent.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
