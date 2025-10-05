import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TermsAndConditions } from "@/components/ui/terms-and-conditions"

export function CompleteProfileForm({
  className,
  onSubmit,
  email,
  onEmailChange,
  submitting,
  name,
  onNameChange,
  lastName,
  onLastNameChange,
  ...props
}: any) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="items-center gap-2">
          <CardTitle className="text-lg">Completa tu perfil</CardTitle>
          <CardDescription>
            Introduce tu nombre y apellidos para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan"
                  value={name}
                  onChange={onNameChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Pérez"
                  value={lastName}
                  onChange={onLastNameChange}
                />
              </div>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Completando perfil…" : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <TermsAndConditions className="mt-4" />
    </div>
  )
}
