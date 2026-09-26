import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
type Product = {
    id: string;
    name: string;
    price: number;
  };
  
  type CartItem = {
    product: Product;
    quantity: number;
  };
  
  const mockProducts: Product[] = [
    { id: "1", name: "Pan Integral", price: 10 },
    { id: "2", name: "Jugo Naranja", price: 15 },
    { id: "3", name: "Queso Oaxaca", price: 60 },
  ];
  
export default function PointOfSale() {
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("efectivo");
    const [received, setReceived] = useState("");
    const [open, setOpen] = useState(false);
  
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const change = parseFloat(received || "0") - total;
  
    const addToCart = (product: Product) => {
      setCart((prev) => {
        const index = prev.findIndex((item) => item.product.id === product.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index].quantity += 1;
          return updated;
        }
        return [...prev, { product, quantity: 1 }];
      });
    };
  
    const handleCheckout = () => {
      console.log("Procesando venta...", {
        cart,
        paymentMethod,
        total,
        received,
        change,
      });
      // Aquí puedes enviar la venta al backend
      setCart([]);
      setReceived("");
      setOpen(false);
    };
  
  // En tu componente PointOfSale:
const [client, setClient] = useState<{ id: string; name: string } | null>(null);

const fetchClients = async (q: string) => {
  // Aquí haces una llamada real a tu API si es necesario
  const res = await fetch(`/api/clients?search=${q}`);
  return res.json(); // debe devolver [{ id, name }]
};

  return (
    <div className="grid grid-cols-2 gap-6 p-6  mx-auto">
      {/* Panel de productos */}

      <div className="space-y-4">

        <div className="space-y-1">
            <label className="text-sm font-medium">Cliente</label>
            <SearchableSelect
                value={client?.id || ""}
                fetchOptions={fetchClients}
                onValueChange={(id) => {
                setClient({id, name:'fulano'}); // elige cliente completo con { id, name }
                }}
                placeholder="Buscar cliente por nombre o correo"
            />
            {client && (
                <p className="text-sm text-muted-foreground">
                Cliente seleccionado: <span className="font-semibold">{client.name}</span>
                </p>
            )}
        </div>

        <label className="text-sm font-medium"></label>
        <Input
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          {mockProducts
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((product) => (
              <Card
                key={product.id}
                onClick={() => addToCart(product)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4 text-center space-y-2">
                  <h4 className="text-lg font-semibold">{product.name}</h4>
                  <p className="text-muted-foreground">${product.price}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Panel del carrito */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Carrito</h2>
        <div className="border rounded p-4 space-y-2 h-96 overflow-y-auto bg-muted/20">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">No hay productos en el carrito</p>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center">
                <span>{item.product.name}</span>
                <span className="text-sm">
                  x{item.quantity} = ${item.product.price * item.quantity}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="text-right font-semibold text-lg">Total: ${total}</div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary">Imprimir</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button disabled={cart.length === 0}>💳 Cobrar</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Procesar pago</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Método de pago</label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">Efectivo</SelectItem>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {paymentMethod === "efectivo" && (
                  <div>
                    <label className="text-sm font-medium">Monto recibido</label>
                    <Input
                      type="number"
                      value={received}
                      onChange={(e) => setReceived(e.target.value)}
                    />
                    {change >= 0 && (
                      <p className="text-sm mt-1">
                        Cambio: <span className="font-bold">${change.toFixed(2)}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleCheckout}>Confirmar pago</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
