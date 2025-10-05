"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, Trash2, Copy, Settings } from "lucide-react"
import { FaWhatsapp, FaFacebookMessenger, FaInstagram, FaTelegram, FaSms } from "react-icons/fa"
import { toast } from "sonner"

interface Integration {
  id: string
  store_id: string
  provider: string
  display_name: string
  status: string
  last_health_check: string | null
  created_at: string
  updated_at: string
}

interface IntegrationsTableProps {
  integrations: Integration[]
  loading: boolean
}

const getProviderInfo = (provider: string) => {
  const providers: Record<string, { name: string; icon: any; color: string }> = {
    whatsapp_meta: {
      name: 'WhatsApp Business',
      icon: FaWhatsapp,
      color: '#25D366',
    },
    facebook_messenger: {
      name: 'Facebook Messenger',
      icon: FaFacebookMessenger,
      color: '#0084FF',
    },
    instagram_meta: {
      name: 'Instagram',
      icon: FaInstagram,
      color: '#E4405F',
    },
    telegram_bot: {
      name: 'Telegram Bot',
      icon: FaTelegram,
      color: '#0088CC',
    },
    sms_twilio: {
      name: 'SMS Twilio',
      icon: FaSms,
      color: '#F22F46',
    },
  }
  return providers[provider] || { name: provider, icon: FaSms, color: '#6B7280' }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'connected':
      return <Badge variant="success">Conectado</Badge>
    case 'disconnected':
      return <Badge variant="secondary">Desconectado</Badge>
    case 'error':
      return <Badge variant="destructive">Error</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function IntegrationsTable({ integrations, loading }: IntegrationsTableProps) {
  const router = useRouter()

  const handleRowClick = (integration: Integration) => {
    router.push(`/panel/bots/integraciones/${integration.id}`)
  }

  const handleContextMenuAction = (action: string, integration: Integration, e: React.MouseEvent) => {
    e.stopPropagation()
    
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(integration.id)
        toast.success("ID de integración copiado")
        break
      case 'view':
        router.push(`/panel/bots/integraciones/${integration.id}`)
        break
    }
  }

  const columns: ColumnDef<Integration>[] = [
    {
      accessorKey: "integration_info",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Integración
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const integration = row.original
        const providerInfo = getProviderInfo(integration.provider)
        const Icon = providerInfo.icon

        return loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-md" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${providerInfo.color}20` }}
            >
              <Icon className="h-5 w-5" style={{ color: providerInfo.color }} />
            </div>
            <div className="flex flex-col">
              <p className="font-medium text-sm">{integration.display_name}</p>
              <p className="text-xs text-muted-foreground">{providerInfo.name}</p>
            </div>
          </div>
        )
      },
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.original.status
        return loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          getStatusBadge(status)
        )
      },
    },
    {
      accessorKey: "last_health_check",
      header: "Última verificación",
      cell: ({ row }) => {
        const lastCheck = row.original.last_health_check
        return loading ? (
          <Skeleton className="h-4 w-24" />
        ) : lastCheck ? (
          <span className="text-sm text-muted-foreground">
            {formatDate(lastCheck)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">Nunca</span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha de creación
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const createdAt = row.original.created_at
        return loading ? (
          <Skeleton className="h-4 w-28" />
        ) : (
          <span className="text-sm">{formatDate(createdAt)}</span>
        )
      },
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const integration = row.original
        return loading ? (
          <Skeleton className="h-8 w-8 rounded-full" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(integration.id)
                toast.success("ID de integración copiado")
              }}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/panel/bots/integraciones/${integration.id}`)}>
                <Settings className="mr-2 h-4 w-4" />
                Configurar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id || column.accessorKey}>
                  {typeof column.header === 'string' ? column.header : column.header({ column: {} as any })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : integrations.length ? (
              integrations.map((integration) => (
                <ContextMenu key={integration.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      onClick={() => handleRowClick(integration)}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id || column.accessorKey}>
                          {column.cell ? column.cell({ row: { original: integration } } as any) : null}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={(e) => handleContextMenuAction('copy', integration, e)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </ContextMenuItem>
                    <ContextMenuItem onClick={(e) => handleContextMenuAction('view', integration, e)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron integraciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
