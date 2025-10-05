"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Edit, Filter, MoreHorizontal, Plus, Settings, Trash2, Power, PowerOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EditIntegrationDialog } from "./edit-integration-dialog"
import { IntegrationModals } from "./integration-modals"
import { integrationsController } from "@/controllers/integrationsController"
import { toast } from "sonner"
import { FaWhatsapp, FaFacebookMessenger, FaInstagram, FaTelegram, FaSms } from "react-icons/fa"

// Integraciones estáticas disponibles
const AVAILABLE_INTEGRATIONS = [
  {
    id: 'whatsapp_meta',
    provider: 'whatsapp_meta',
    display_name: 'WhatsApp Business',
    color: '#25D366',
    icon: FaWhatsapp
  },
  {
    id: 'facebook_messenger',
    provider: 'facebook_messenger',
    display_name: 'Facebook Messenger',
    color: '#0084FF',
    icon: FaFacebookMessenger
  },
  {
    id: 'instagram_meta',
    provider: 'instagram_meta',
    display_name: 'Instagram',
    color: '#E4405F',
    icon: FaInstagram
  },
  {
    id: 'telegram_bot',
    provider: 'telegram_bot',
    display_name: 'Telegram Bot',
    color: '#0088CC',
    icon: FaTelegram
  },
  {
    id: 'sms_twilio',
    provider: 'sms_twilio',
    display_name: 'SMS Twilio',
    color: '#F22F46',
    icon: FaSms
  }
]

interface UserIntegration {
  id: string
  store_id: string
  provider: string
  display_name: string
  status: string
  last_health_check: string | null
  created_at: string
  updated_at: string
}

interface IntegrationTableProps {
  userIntegrations: UserIntegration[]
  loading: boolean
  setUserIntegrations: (integrations: UserIntegration[]) => void
}

export function IntegrationTable({ userIntegrations, loading, setUserIntegrations }: IntegrationTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedIntegration, setSelectedIntegration] = useState<UserIntegration | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentIntegration, setCurrentIntegration] = useState<any>(null)

  // Función para obtener el estado de una integración
  const getIntegrationStatus = (provider: string) => {
    const userIntegration = userIntegrations.find(integration => integration.provider === provider)
    return userIntegration ? userIntegration.status : 'inactive'
  }

  // Función para obtener si una integración está configurada
  const isIntegrationConfigured = (provider: string) => {
    return userIntegrations.some(integration => integration.provider === provider)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Activo</Badge>
      case 'disconnected':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Inactivo</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      case 'inactive':
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">No configurado</Badge>
    }
  }

  const handleIntegrationCreated = (newIntegration: UserIntegration) => {
    // Agregar la nueva integración a la lista
    setUserIntegrations([...userIntegrations, newIntegration])
  }

  const handleIntegrationUpdated = (updatedIntegration: UserIntegration) => {
    // Actualizar la integración en la lista
    setUserIntegrations(userIntegrations.map(integration => 
      integration.id === updatedIntegration.id ? updatedIntegration : integration
    ))
  }

  const handleRowClick = (integration: any) => {
    // Siempre abrir el modal específico del tipo de integración
    const userIntegration = userIntegrations.find(ui => ui.provider === integration.provider)
    
    setCurrentIntegration({ 
      ...integration, 
      userData: userIntegration || null 
    })
    setModalOpen(true)
  }

  const handleToggleIntegration = async (provider: string) => {
    const userIntegration = userIntegrations.find(integration => integration.provider === provider)
    
    if (userIntegration) {
      // Si existe, cambiar estado
      try {
        const result = await integrationsController.toggleIntegration(userIntegration.id)
        if (result instanceof Error) {
          toast.error("Error al cambiar el estado de la integración")
          return
        }
        
        // Actualizar el estado en la lista
        setUserIntegrations(userIntegrations.map(integration => 
          integration.id === userIntegration.id 
            ? { ...integration, status: integration.status === 'connected' ? 'disconnected' : 'connected' }
            : integration
        ))
      } catch (error) {
        console.error("Error toggling integration:", error)
        toast.error("Error al cambiar el estado")
      }
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setCurrentIntegration(null)
  }

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "display_name",
      id: "integration-info",
      header: ({ column }) => (
        <div className="text-sm font-medium px-2">
          Integración
        </div>
      ),
      cell: ({ row }) => {
        const integration = row.original
        const IconComponent = integration.icon
        
        return loading ? (
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: integration.color }}
            >
              <IconComponent size={20} />
            </div>
            <div>
              <p className="font-medium">{integration.display_name}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      id: "status-info",
      header: ({ column }) => (
       <div className="text-sm font-medium px-2">
        Estado
       </div>
      ),
      cell: ({ row }) => {
        const integration = row.original
        const status = getIntegrationStatus(integration.provider)
        
        return loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          getStatusBadge(status)
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const integration = row.original
        const isConfigured = isIntegrationConfigured(integration.provider)
        const status = getIntegrationStatus(integration.provider)

        return loading ? (
          <Skeleton className="h-8 w-8" />
        ) : (
          <div className="flex items-center gap-2">
            {isConfigured && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleIntegration(integration.provider)
                }}
              >
                {status === 'connected' ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    Activar
                  </>
                )}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    const userIntegration = userIntegrations.find(ui => ui.provider === integration.provider)
                    setCurrentIntegration({ 
                      ...integration, 
                      userData: userIntegration || null 
                    })
                    setModalOpen(true)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Configurar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: AVAILABLE_INTEGRATIONS,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={columns.length} className="h-24">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-md" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
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
     

      {/* Diálogo de edición/creación */}
      <EditIntegrationDialog 
        integration={selectedIntegration}
        onIntegrationUpdated={handleIntegrationUpdated}
        onIntegrationCreated={handleIntegrationCreated}
      />

      {/* Modales específicos por tipo de integración */}
      <IntegrationModals
        integration={currentIntegration}
        integrationId={currentIntegration?.userData?.id || ''}
        isOpen={modalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}
