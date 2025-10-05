import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso de Botivent",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-muted-foreground mb-6">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground mb-4">
              Al acceder y utilizar Botivent, usted acepta estar sujeto a estos términos y condiciones de uso. 
              Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Descripción del Servicio</h2>
            <p className="text-muted-foreground mb-4">
              Botivent es una plataforma que permite a los usuarios crear y gestionar chatbots para sus negocios, 
              integrar sistemas de pago y conectar con diversas plataformas de mensajería.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Uso Aceptable</h2>
            <p className="text-muted-foreground mb-4">
              Usted se compromete a utilizar Botivent únicamente para fines legales y de acuerdo con estos términos. 
              No debe utilizar el servicio para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Actividades ilegales o fraudulentas</li>
              <li>Enviar spam o contenido no deseado</li>
              <li>Violar derechos de propiedad intelectual</li>
              <li>Interferir con el funcionamiento del servicio</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cuentas de Usuario</h2>
            <p className="text-muted-foreground mb-4">
              Para utilizar ciertas funciones de Botivent, debe crear una cuenta. Usted es responsable de:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Todas las actividades que ocurran bajo su cuenta</li>
              <li>Notificarnos inmediatamente sobre cualquier uso no autorizado</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Facturación y Pagos</h2>
            <p className="text-muted-foreground mb-4">
              Los precios y términos de facturación se especifican en nuestra página de precios. 
              Los pagos son procesados de forma segura y no almacenamos información de tarjetas de crédito.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propiedad Intelectual</h2>
            <p className="text-muted-foreground mb-4">
              Botivent y su contenido original, características y funcionalidad son propiedad de Botivent 
              y están protegidos por leyes de derechos de autor, marcas registradas y otras leyes de propiedad intelectual.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitación de Responsabilidad</h2>
            <p className="text-muted-foreground mb-4">
              En ningún caso Botivent será responsable por daños indirectos, incidentales, especiales, 
              consecuenciales o punitivos, incluyendo pero no limitado a, pérdida de beneficios, datos, 
              uso u otras pérdidas intangibles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Modificaciones</h2>
            <p className="text-muted-foreground mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Las modificaciones entrarán en vigor inmediatamente después de su publicación en esta página.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contacto</h2>
            <p className="text-muted-foreground mb-4">
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en:
            </p>
            <p className="text-muted-foreground">
              Email: legal@botivent.com<br />
              Dirección: [Dirección de la empresa]
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
