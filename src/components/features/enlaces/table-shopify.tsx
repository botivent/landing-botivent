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
import { ArrowUpDown, Copy, ExternalLink, Filter, MoreHorizontal, Plus, Settings, Trash2 } from "lucide-react"
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

interface ShopifyCheckout {
  id: string
  store_id: string
  checkout_url: string
  shopify_checkout_id: string
  product_ids: { id: string; quantity: number }[]
  total_price: number
  currency: string
  is_completed: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
}

interface ShopifyCheckoutTableProps {
  checkouts: ShopifyCheckout[] | number[]
  loading: boolean
  setCheckouts: (checkouts: ShopifyCheckout[]) => void
}

export function ShopifyCheckoutTable({ checkouts, loading, setCheckouts }: ShopifyCheckoutTableProps) {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<any>({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [checkoutToDelete, setCheckoutToDelete] = useState<{ id: string } | null>(null)

  const router = useRouter()

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: currency || "EUR",
    }).format(price / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const columns: ColumnDef<ShopifyCheckout>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        if (loading) return <Skeleton className="h-4 w-24 mx-auto" />
        return (
          <div className="text-xs text-muted-foreground truncate max-w-[120px] mx-auto">
            {row.original.id}
          </div>
        )
      },
    },
    {
      accessorKey: "checkout_url",
      header: "Checkout Link",
      cell: ({ row }) => {
        if (loading)
          return (
            <div className="flex justify-center">
              <Skeleton className="h-4 w-48" />
            </div>
          )
        return (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(row.original.checkout_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Checkout
            </Button>
          </div>
        )
      },
    },
    {
      accessorKey: "product_ids",
      header: "Productos",
      cell: ({ row }) => {
        if (loading)
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          )
        const count = row.original.product_ids?.length || 0
        const totalQuantity = row.original.product_ids?.reduce(
          (acc, p) => acc + (p.quantity || 0),
          0
        )
        return (
          <div className="text-center text-sm">
            <span className="font-medium">{count}</span> item{count !== 1 ? "s" : ""}
            <div className="text-xs text-muted-foreground">
              Total: {totalQuantity}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "total_price",
      header: "Valor Total",
      cell: ({ row }) => {
        if (loading)
          return <Skeleton className="h-4 w-16 mx-auto" />
        return (
          <div className="text-center font-medium">
            {formatPrice(row.original.total_price, row.original.currency)}
          </div>
        )
      },
    },
    {
      accessorKey: "is_completed",
      header: "Estado",
      cell: ({ row }) => {
        if (loading)
          return (
            <div className="flex justify-center">
              <Skeleton className="h-6 w-16" />
            </div>
          )
        const completed = row.original.is_completed
        const expired =
          row.original.expires_at && new Date(row.original.expires_at) < new Date()
        const variant = completed ? "default" : expired ? "secondary" : "outline"
        const label = completed
          ? "Completado"
          : expired
          ? "Expirado"
          : "Activo"
        return (
          <div className="flex justify-center">
            <Badge variant={variant}>{label}</Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "expires_at",
      header: "Expira",
      cell: ({ row }) => {
        if (loading)
          return <Skeleton className="h-4 w-24 mx-auto" />
        const expiresAt = row.original.expires_at
        return (
          <div className="text-center text-sm">
            {expiresAt ? formatDate(expiresAt) : "—"}
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
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
          >
            Creado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (loading) return <Skeleton className="h-4 w-24 mx-auto" />
        return (
          <div className="text-center">
            {formatDate(row.original.created_at)}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        if (loading)
          return (
            <div className="flex justify-center">
              <Skeleton className="h-8 w-8" />
            </div>
          )
        const checkout = row.original
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(checkout.checkout_url)
                  }
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open(checkout.checkout_url, "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver checkout
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() =>
                    setCheckoutToDelete({ id: checkout.id })
                  }
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
    data: loading ? Array(5).fill({}) : checkouts,
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

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filtrar checkouts..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={loading}
          />

          {/* Filtro de estado */}
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
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                <Checkbox checked={statusFilter === "all"} className="mr-2" />
                Todos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                <Checkbox checked={statusFilter === "active"} className="mr-2" />
                Activos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
                <Checkbox
                  checked={statusFilter === "completed"}
                  className="mr-2"
                />
                Completados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("expired")}>
                <Checkbox checked={statusFilter === "expired"} className="mr-2" />
                Expirados
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
                .map((column) => (
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
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            disabled={loading}
            onClick={() => router.push("/panel/tienda/enlaces-de-pago/nuevo")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Checkout
          </Button>
        </div>
      </div>

      {/* Tabla */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((column, cellIndex) => (
                        <TableCell key={cellIndex} className="text-center">
                          {flexRender(
                            column.cell,
                            {
                              row: { original: {} },
                              getValue: () => null,
                              renderValue: () => null,
                            } as any
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              : table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <ContextMenu key={row.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="cursor-pointer hover:bg-muted/50"
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
                        onClick={() =>
                          navigator.clipboard.writeText(row.original.checkout_url)
                        }
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar link
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          window.open(row.original.checkout_url, "_blank")
                        }
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver checkout
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          setCheckoutToDelete({ id: row.original.id })
                        }
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No hay checkouts creados.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
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
        enlace={checkoutToDelete}
        onClose={() => setCheckoutToDelete(null)}
        onSuccessDelete={() =>
          setCheckouts(
            (checkouts as ShopifyCheckout[]).filter(
              (c) => c.id !== checkoutToDelete?.id
            )
          )
        }
      />
    </div>
  )
}
