
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/hooks/useProduct";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: product, isLoading, error } = useProduct(id);
  const updateProductMutation = useUpdateProduct();
  
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  
  // Update form when product data is loaded
  useState(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setSku(product.sku || "");
      setPrice(product.price.toString());
      setImageUrl(product.image_url || "");
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue < 0) {
        toast.error("Введите корректную цену");
        return;
      }
      
      await updateProductMutation.mutateAsync({
        id,
        name,
        description: description || null,
        sku: sku || null,
        price: priceValue,
        image_url: imageUrl || null
      });
      
      toast.success("Товар успешно обновлен");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при обновлении: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при обновлении");
      }
    }
  };
  
  if (error) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>
        <div className="text-red-500">
          Ошибка при загрузке товара: {error instanceof Error ? error.message : "Неизвестная ошибка"}
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>
        <div>Товар не найден</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" /> Назад к товарам
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Редактирование товара</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Наименование*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите наименование товара"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите товар"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">Артикул</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SKU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Цена*</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL изображения</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {imageUrl && (
                <div className="mt-2 max-w-xs">
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="rounded-md border h-auto w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.alt = "Ошибка загрузки изображения";
                    }} 
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={updateProductMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {updateProductMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
