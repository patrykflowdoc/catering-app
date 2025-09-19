import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DeliveryDay } from "@shared/schema";
import { Receipt, Utensils, Phone, Mail, Clock, Calendar } from "lucide-react";

interface OrderSummaryProps {
  deliveryDays: DeliveryDay[];
}

export function OrderSummary({ deliveryDays }: OrderSummaryProps) {
  const days = Array.isArray(deliveryDays) ? deliveryDays : [];
  const subtotal = days.reduce((sum, day) => 
    sum + ((day.selectedItems ?? []).reduce((daySum, item) => daySum + (item.price ?? 0), 0) * (day.numberOfPeople ?? 1)), 0
  );
  const deliveryFee = days.length > 0 ? 10 * days.length : 0;
  const total = subtotal + deliveryFee;
  const totalItems = days.reduce((sum, day) => sum + (day.selectedItems?.length ?? 0), 0);

  return (
    <Card className="bg-card rounded-lg shadow-sm border border-border sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Receipt className="text-primary mr-2 h-5 w-5" />
          Podsumowanie zamówienia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-6" data-testid="order-summary-items">
          {totalItems === 0 ? (
            <div className="text-center text-muted-foreground py-8" data-testid="empty-order-message">
              <Utensils className="text-4xl mb-3 mx-auto h-16 w-16" />
              <p>Wybierz dania z menu</p>
            </div>
          ) : (
            deliveryDays.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-2">
                {day.selectedItems.length > 0 && (
                  <>
                    <div className="flex items-center text-sm font-semibold text-foreground border-b border-border pb-1">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      Dzień {dayIndex + 1}
                      {day.date && (
                        <span className="ml-2 text-muted-foreground font-normal">
                          ({new Date(day.date).toLocaleDateString('pl-PL')})
                        </span>
                      )}
                      <span className="ml-2 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        {day.numberOfPeople ?? 1} {(day.numberOfPeople ?? 1) === 1 ? 'osoba' : 'osób'}
                      </span>
                    </div>
                    {day.selectedItems.map((item) => (
                      <div 
                        key={`${dayIndex}-${item.id}`} 
                        className="flex justify-between items-center p-2 bg-accent rounded border border-border ml-4"
                        data-testid={`summary-item-${dayIndex}-${item.id}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground" data-testid={`summary-name-${dayIndex}-${item.id}`}>
                            {item.name}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-primary" data-testid={`summary-price-${dayIndex}-${item.id}`}>
                          {item.price} zł × {day.numberOfPeople ?? 1} = {(item.price * (day.numberOfPeople ?? 1))} zł
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground">Suma częściowa:</span>
            <span className="font-semibold text-foreground" data-testid="subtotal">
              {subtotal} zł
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground">
              Dostawa ({deliveryDays.length} {deliveryDays.length === 1 ? 'dzień' : 'dni'}):
            </span>
            <span className="font-semibold text-foreground" data-testid="delivery-fee">
              {deliveryFee} zł
            </span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-border pt-2">
            <span className="text-foreground">Razem:</span>
            <span className="text-primary" data-testid="total">
              {total} zł
            </span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-semibold text-foreground mb-3">Potrzebujesz pomocy?</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Phone className="mr-2 text-primary h-4 w-4" />
              +48 123 456 789
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 text-primary h-4 w-4" />
              zamowienia@katering.pl
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 text-primary h-4 w-4" />
              Pn-Pt 8:00-18:00
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}