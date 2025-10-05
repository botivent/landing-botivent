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
} from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit, Filter, MoreHorizontal, Plus, Settings, Trash2, ExternalLink } from "lucide-react"
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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DeleteDialog } from "./delete-dialog"

interface PaymentLink {
  id: string
  store_id: string
  name: string
  description: string
  items: {
    product: {
      id: string
      media: {
        id: string
        alt: string
        url: string
        created_at: string
        product_id: string
        sort_order: number
      }[]
      price: {
        amount: number
      }
      title: string
    }
    variant: {
      id: string
      sku: string
      price: number
      stock: number
      attributes: {
        name: string
        value: string
      }[]
    }
    quantity: number
  }[]
  is_active: boolean
  expires_at: string | null
  max_uses: number | null
  usage_count: number
  is_shipping_address_required: boolean
  is_billing_address_required: boolean
  public_id: string
  created_at: string
  updated_at: string
}

interface PaymentLinkTableProps {
  paymentLinks: PaymentLink[] | number[]
  loading: boolean
  setPaymentLinks: (paymentLinks: PaymentLink[]) => void
}

export function PaymentLinkTable({ paymentLinks, loading, setPaymentLinks }: PaymentLinkTableProps) {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<any>({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [linkToDelete, setLinkToDelete] = useState<{id: string, name: string} | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTotalItems = (items: any[]) => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalValue = (items: any[]) => {
    return items.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
  }

  const columns: ColumnDef<PaymentLink>[] = [
    {
      accessorKey: "items",
      id: "productos",
      header: "Productos",
      enableHiding: false,
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex justify-center">
              <Skeleton className="h-[60px] w-[60px] rounded-md" />
            </div>
          )
        }
        const link = row.original
        const firstItem = link.items?.[0]
        const firstImage = firstItem?.product?.media?.[0]
        
        return (
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <img 
                src={firstImage?.url} 
                alt={firstImage?.alt || firstItem?.product?.title}
                width={60}
                height={60}
                className="rounded-md object-cover"
              />
              <div className="text-xs text-muted-foreground text-center">
                {link.items.length} producto{link.items.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Enlace de Pago
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          )
        }
        return (
          <div className="flex flex-col items-center justify-center">
            <div className="font-medium truncate">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {row.original.description}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "items",
      id: "valor-total",
      header: "Valor Total",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          )
        }
        const totalValue = getTotalValue(row.original.items)
        return (
          <div className="text-center">
            {formatPrice(totalValue)}
          </div>
        )
      },
    },
    {
      accessorKey: "items",
      id: "items-count",
      header: "Items",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          )
        }
        const totalItems = getTotalItems(row.original.items)
        return (
          <div className="text-center">
            <span className="font-medium">{totalItems}</span>
            <div className="text-xs text-muted-foreground">
              {row.original.items.length} producto{row.original.items.length !== 1 ? 's' : ''}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "is_active",
      header: "Estado",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex justify-center">
              <Skeleton className="h-6 w-16" />
            </div>
          )
        }
        const isActive = row.getValue("is_active")
        return (
          <div className="flex justify-center">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "usage_count",
      header: "Usos",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-12 mx-auto" />
            </div>
          )
        }
        const usageCount = row.getValue("usage_count")
        const maxUses = row.original.max_uses
        return (
          <div className="text-center">
            <span className="font-medium">{usageCount}</span>
            {maxUses !== null && (
              <div className="text-xs text-muted-foreground">
                / {maxUses}
              </div>
            )}
          </div>
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
            Creado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
          )
        }
        return (
          <div className="text-center">
            {formatDate(row.getValue("created_at"))}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex justify-center">
              <Skeleton className="h-8 w-8" />
            </div>
          )
        }
        const link = row.original
        const router = useRouter()
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Abrir menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(link.public_id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(`/p/${link.public_id}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver enlace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/panel/tienda/enlaces-de-pago/${link.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600 hover:text-red-600!"
                  onClick={() => setLinkToDelete({ id: link.id, name: link.name })}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: loading ? Array(5).fill({}) : paymentLinks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const router = useRouter()

  const handleRowClick = (link: PaymentLink) => {
    router.push(`/panel/tienda/enlaces-de-pago/${link.id}`)
  }

  const handleContextMenuAction = (action: string, link: PaymentLink, e: React.MouseEvent) => {
    e.stopPropagation()
    
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(link.public_id)
        break
      case 'view':
        window.open(`/p/${link.public_id}`, '_blank')
        break
      case 'edit':
        router.push(`/panel/tienda/enlaces-de-pago/${link.id}`)
        break
      case 'delete':
        setLinkToDelete({ id: link.id, name: link.name })
        break
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filtrar enlaces..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={loading}
          />
          
          {/* Filtro por estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                <Filter className="mr-2 h-4 w-4" />
                Estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filtrar por estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setStatusFilter("all")}
              >
                <Checkbox 
                  checked={statusFilter === "all"} 
                  className="mr-2" 
                />
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("active")}
              >
                <Checkbox 
                  checked={statusFilter === "active"} 
                  className="mr-2" 
                />
                Activos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("inactive")}
              >
                <Checkbox 
                  checked={statusFilter === "inactive"} 
                  className="mr-2" 
                />
                Inactivos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Menú de columnas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                <Settings className="mr-2 h-4 w-4" />
                Columnas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="default" size="sm" disabled={loading} onClick={() => router.push("/panel/tienda/enlaces-de-pago/nuevo")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo enlace
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
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
              // Filas de skeleton durante la carga
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={cellIndex} className="text-center">
                      {flexRender(
                        column.cell,
                        {
                          row: { original: {} },
                          getValue: () => null,
                          renderValue: () => null
                        } as any
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem
                      onClick={(e) => handleContextMenuAction('copy', row.original, e)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={(e) => handleContextMenuAction('view', row.original, e)}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver enlace
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={(e) => handleContextMenuAction('edit', row.original, e)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={(e) => handleContextMenuAction('delete', row.original, e)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay enlaces de pago.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={loading || !table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={loading || !table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <DeleteDialog 
        product={linkToDelete} 
        onClose={() => {setLinkToDelete(null)}} 
        onSuccessDelete={() => {setPaymentLinks((paymentLinks as PaymentLink[]).filter((link) => link.id !== linkToDelete?.id))}} 
      />
    </div>
  )
}
