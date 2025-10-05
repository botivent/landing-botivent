"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Eye, Copy, ExternalLink, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ordersController } from "@/controllers/ordersController"
import { toast } from "sonner"
import { useBreadcrumbsPage } from "@/hooks/use-breadcrumbs"

interface Order {
  id: string
  store_id: string
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
  amount_paid: number
  stripe_payment_intent_id: string
  stripe_account_id: string
  billing_address: any
  shipping_address: {
    name: string
    address: {
      city: string
      line1: string
      line2?: string
      state: string
      country: string
      postal_code: string
    }
  } | null
  status: string
  customer_email: string
  customer_name: string
  paid_at: string | null
  created_at: string
  updated_at: string
  public_id: string
}

export function OrdersTable() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  useBreadcrumbsPage([
    {
      path: "/panel",
      name: "Panel"
    },
    {
      path: "/panel/tienda",
      name: "Tienda"
    },
    {
      path: "/panel/tienda/pedidos",
      name: "Pedidos"
    }
  ])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const result = await ordersController.getOrders()
      
      if (result instanceof Error) {
        toast.error("Error al cargar los pedidos")
        return
      }

      setOrders(result)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error al cargar los pedidos")
    } finally {
      setLoading(false)
    }
  }

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
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pagado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Fallido</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const copyOrderId = async (orderId: string) => {
    try {
      await navigator.clipboard.writeText(orderId)
      toast.success("ID del pedido copiado")
    } catch (error) {
      toast.error("Error al copiar el ID")
    }
  }

  const handleRowClick = (order: Order) => {
    router.push(`/panel/tienda/pedidos/${order.id}`)
  }

  const handleContextMenuAction = (action: string, order: Order, e: React.MouseEvent) => {
    e.stopPropagation()
    switch (action) {
      case 'copy':
        copyOrderId(order.id)
        break
      case 'view':
        router.push(`/panel/tienda/pedidos/${order.id}`)
        break
    }
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Pedido",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
              {loading ? (
                <Skeleton className="w-full h-full" />
              ) : order.items[0]?.product.media[0] ? (
                <img
                  src={order.items[0].product.media[0].url}
                  alt={order.items[0].product.media[0].alt || order.items[0].product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">#</span>
                </div>
              )}
            </div>
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </>
              ) : (
                <>
                  <p className="font-medium text-sm">#{order.public_id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                </>
              )}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "items",
      header: "Productos",
      cell: ({ row }) => {
        const order = row.original
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
        return (
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </>
            ) : (
              <>
                <p className="font-medium text-sm">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                <p className="text-xs text-muted-foreground">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''} diferente{order.items.length !== 1 ? 's' : ''}
                </p>
              </>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "amount_paid",
      header: "Total",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div className="text-right">
            {loading ? (
              <Skeleton className="h-4 w-16 ml-auto" />
            ) : (
              <p className="font-medium">{formatPrice(order.amount_paid)}</p>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const order = row.original
        return loading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          getStatusBadge(order.status)
        )
      },
    },
    {
      accessorKey: "customer_email",
      header: "Cliente",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </>
            ) : (
              <>
                <p className="font-medium text-sm">{order.customer_name}</p>
                <p className="text-xs text-muted-foreground">{order.customer_email}</p>
              </>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: ({ row }) => {
        const order = row.original
        return (
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </>
            ) : (
              <>
                <p className="text-sm">{formatDate(order.created_at)}</p>
                {order.paid_at && (
                  <p className="text-xs text-muted-foreground">
                    Pagado: {formatDate(order.paid_at)}
                  </p>
                )}
              </>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const order = row.original
        return loading ? (
          <Skeleton className="h-8 w-8" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => copyOrderId(order.id)}>
                <Copy className="mr-2 h-4 w-4" />
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/panel/tienda/pedidos/${order.id}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver detalles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: orders,
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

  const rows = table.getRowModel()?.rows || []

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-10 max-w-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Table */}
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
              // Skeletons para cada fila
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-md" />
                      <div>
                        <Skeleton className="h-4 w-20 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <ContextMenu key={row.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={(e) => handleContextMenuAction('copy', row.original, e)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar ID
                    </ContextMenuItem>
                    <ContextMenuItem onClick={(e) => handleContextMenuAction('view', row.original, e)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalles
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
                  No hay pedidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {loading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </>
          )}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
