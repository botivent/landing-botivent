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
import { ArrowUpDown, Copy, Edit, Eye, Filter, MoreHorizontal, Plus, Settings, Trash2 } from "lucide-react"
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
import { DeleteDialog } from "./delete-dialog"
import { FaShopify } from "react-icons/fa"

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  currency: string
  is_public: boolean
  created_at: string
  variants: any[]
  media?: {
    id: string
    url: string
    alt: string
  }[]
}

interface ProductTableProps {
  products: Product[] |  number[]
  loading: boolean
  setProducts: (products: Product[]) => void
}

export function ProductTable({ products, loading, setProducts }: ProductTableProps) {
  const [sorting, setSorting] = useState<any[]>([])
  const [columnFilters, setColumnFilters] = useState<any[]>([])
  const [columnVisibility, setColumnVisibility] = useState<any>({})
  const [rowSelection, setRowSelection] = useState({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [productToDelete, setProductToDelete] = useState<{id: string, title: string} | null>(null)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getTotalStock = (variants: any[]) => {
    return variants.reduce((total, variant) => total + variant.stock, 0)
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "media",
      header: "Imagen",
      enableHiding: false,
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex justify-center">
              <Skeleton className="h-[100px] w-[100px] rounded-md" />
            </div>
          )
        }
        const product = row.original
        const firstImage = product.media?.[0]
        
        return (
          <div className="flex justify-center">
            <img 
              src={firstImage?.url} 
              alt={firstImage?.alt || product.title}
              width={100}
              height={100}
              className="rounded-md"
            />
          </div>
        )
      },
    },
    {
      accessorKey: "title",
      enableHiding: false,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Producto
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
            <div className="font-medium truncate">{row.getValue("title")}</div>
            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
              {row.original.description}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Precio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          )
        }
        return (
          <div className="text-center">
            {formatPrice(row.getValue("price"), row.original.currency)}
          </div>
        )
      },
    },
    {
      accessorKey: "variants",
      header: "Stock",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="text-center">
              <Skeleton className="h-4 w-8 mx-auto mb-1" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          )
        }
        const totalStock = getTotalStock(row.original.variants)
        return (
          <div className="text-center">
            <span className="font-medium">{totalStock}</span>
            <div className="text-xs text-muted-foreground">
              {row.original.variants.length} variantes
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "is_public",
      header: "Estado",
      cell: ({ row }) => {
        if (loading) {
          return (
            <div className="flex justify-center">
              <Skeleton className="h-6 w-16" />
            </div>
          )
        }
        const isPublic = row.getValue("is_public")
        return (
          <div className="flex justify-center">
            <Badge variant={isPublic ? "default" : "secondary"}>
              {isPublic ? "Público" : "Privado"}
            </Badge>
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
        const product = row.original
        console.log("row", row)
        console.log("product", product)
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
                { ! product.is_shopify && (
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(product.id)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar ID
                </DropdownMenuItem>
                )}
                { ! product.is_shopify && (
                <DropdownMenuItem onClick={() => router.push(`/panel/tienda/productos/${product.id}`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                )}
                { ! product.is_shopify && (
                <DropdownMenuItem 
                  className="text-red-600 hover:text-red-600!"
                  onClick={() => setProductToDelete({ id: product.id, title: product.title })}
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                  Eliminar
                </DropdownMenuItem>
                )}
                { product.is_shopify && (
                  <>
                 <DropdownMenuItem onClick={() => router.push(`/panel/tienda/productos/${product.id}`)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver
                </DropdownMenuItem>
                  <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="bg-green-600/50 hover:bg-green-600/80! text-foreground"
                  onClick={() => window.open(product.shopify_data.edit_url, '_blank')}
                >
                  <FaShopify className="mr-2 h-4 w-4 text-foreground" />
                  Editar en Shopify
                </DropdownMenuItem>
                </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: loading ? Array(5).fill({}) : products,
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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filtrar productos..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
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
                onClick={() => setStatusFilter("public")}
              >
                <Checkbox 
                  checked={statusFilter === "public"} 
                  className="mr-2" 
                />
                Públicos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("private")}
              >
                <Checkbox 
                  checked={statusFilter === "private"} 
                  className="mr-2" 
                />
                Privados
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
          <Button variant="default" size="sm" disabled={loading} onClick={() => router.push("/panel/tienda/productos/nuevo")}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo producto
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
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
           {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} páginas
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
        product={productToDelete} 
        onClose={() => {setProductToDelete(null)}} 
        onSuccessDelete={() => {setProducts((products as Product[]).filter((product) => product.id !== productToDelete?.id))}} 
      />
    </div>
  )
}
