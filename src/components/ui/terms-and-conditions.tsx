"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TermsAndConditionsProps {
  className?: string
}

export function TermsAndConditions({ className }: TermsAndConditionsProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`text-muted-foreground text-center text-xs text-balance ${className}`}>
      Al hacer clic en continuar, aceptas nuestros{" "}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="underline underline-offset-4 hover:text-primary">
            Términos de Servicio
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos de Servicio</DialogTitle>
            <DialogDescription>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Aceptación de los Términos</h3>
              <p>
                Al acceder y utilizar este servicio, usted acepta estar sujeto a estos términos y condiciones.
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">2. Descripción del Servicio</h3>
              <p>
                Nuestro servicio proporciona herramientas para la gestión de tiendas online, incluyendo
                pero no limitado a la gestión de productos, pedidos, integraciones y flujos de trabajo.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">3. Uso Aceptable</h3>
              <p>
                Usted se compromete a utilizar nuestro servicio de manera legal y ética. Está prohibido:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Utilizar el servicio para actividades ilegales</li>
                <li>Interferir con el funcionamiento del servicio</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
                <li>Distribuir malware o contenido malicioso</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">4. Privacidad y Datos</h3>
              <p>
                Respetamos su privacidad y protegemos sus datos personales de acuerdo con nuestra
                Política de Privacidad. Sus datos se utilizan únicamente para proporcionar y mejorar
                nuestros servicios.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">5. Modificaciones</h3>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Las modificaciones entrarán en vigor inmediatamente después de su publicación.
                Es su responsabilidad revisar periódicamente estos términos.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">6. Limitación de Responsabilidad</h3>
              <p>
                En la máxima medida permitida por la ley, no seremos responsables de daños
                indirectos, incidentales, especiales o consecuentes que puedan resultar del
                uso de nuestro servicio.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">7. Contacto</h3>
              <p>
                Si tiene preguntas sobre estos términos, puede contactarnos a través de
                los medios de contacto proporcionados en nuestro sitio web.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
      {" "}y{" "}
      <Dialog>
        <DialogTrigger asChild>
          <button className="underline underline-offset-4 hover:text-primary">
            Política de Privacidad
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidad</DialogTitle>
            <DialogDescription>
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Información que Recopilamos</h3>
              <p>
                Recopilamos información que usted nos proporciona directamente, como:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Información de cuenta (nombre, email)</li>
                <li>Información de pago (procesada de forma segura)</li>
                <li>Contenido que crea en nuestra plataforma</li>
                <li>Comunicaciones con nuestro servicio de atención al cliente</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">2. Cómo Utilizamos su Información</h3>
              <p>
                Utilizamos su información para:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Procesar transacciones y pagos</li>
                <li>Comunicarnos con usted sobre el servicio</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">3. Compartir Información</h3>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros,
                excepto en las siguientes circunstancias:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Con su consentimiento explícito</li>
                <li>Para cumplir con obligaciones legales</li>
                <li>Con proveedores de servicios que nos ayudan a operar</li>
                <li>En caso de fusión o adquisición empresarial</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">4. Seguridad de los Datos</h3>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger
                su información personal contra acceso no autorizado, alteración, divulgación
                o destrucción.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">5. Sus Derechos</h3>
              <p>
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Acceder a su información personal</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">6. Cookies y Tecnologías Similares</h3>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar su experiencia,
                analizar el uso del servicio y personalizar el contenido.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">7. Cambios en esta Política</h3>
              <p>
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos
                sobre cambios significativos a través de nuestro servicio o por correo electrónico.
              </p>
            </section>
            
            <section>
              <h3 className="font-semibold mb-2">8. Contacto</h3>
              <p>
                Si tiene preguntas sobre esta política de privacidad o sobre cómo manejamos
                su información, puede contactarnos a través de los medios proporcionados
                en nuestro sitio web.
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
      .
    </div>
  )
}
