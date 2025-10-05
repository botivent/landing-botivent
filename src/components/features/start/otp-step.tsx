"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OtpStep({
  email,
  otp,
  onOtpChange,
  onBack,
  onVerify,
  submitting,
  onResend,
  ...props
}: any) {
  return (
    <Card {...props} className="w-sm">
      <CardHeader>
        <CardTitle className="text-lg">Verifica tu email</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <div className="text-base font-medium text-neutral-1100">{email}</div>
        </div>

        <div className="flex flex-col gap-4 items-center justify-center">
          <div className="text-sm text-neutral-500">Introduce el código</div>
          <InputOTP maxLength={6} onChange={onOtpChange} value={otp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button 
            className="grow-1"
            onClick={onVerify} 
            disabled={submitting || !otp || String(otp).length < 6} 
            loading={submitting}
          >
            Continuar
          </Button>
        </div>
        <div className="flex items-center justify-center gap-0">
          <Button 
            variant="link"
            className="text-neutral-500"
            onClick={onBack} 
            disabled={submitting} 
          >
            Atrás
          </Button>
          <span className="text-neutral-500">|</span>
          <Button 
            className="text-neutral-500"
            variant="link"
            onClick={onResend} 
            disabled={submitting} 
          >
            Reenviar código
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}