import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TermsAndConditions } from "@/components/ui/terms-and-conditions"

export function LoginForm({
  className,
  onSubmit,
  email,
  onEmailChange,
  submitting,
  ...props
}: any) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={onEmailChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Enviando código…" : "Continuar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <TermsAndConditions className="mt-4" />
    </div>
  )
}
