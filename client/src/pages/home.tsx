import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MenuItemCard } from "@/components/menu-item-card";
import { OrderSummary } from "@/components/order-summary";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type MenuItem, type DeliveryDay, type MultiDayOrder, insertOrderSchema } from "@shared/schema";
import { Utensils, User, Soup, UtensilsCrossed, IceCream, StickyNote, ShoppingCart, Phone, Mail, ChevronLeft, ChevronRight, Calendar, Hash } from "lucide-react";
import { z } from "zod";

// Form validation schema
const formSchema = insertOrderSchema.extend({
  customerName: z.string().min(1, "Imię i nazwisko jest wymagane"),
  customerPhone: z.string().min(1, "Numer telefonu jest wymagany"),
  customerEmail: z.string().email("Nieprawidłowy adres email"),
});

type FormData = z.infer<typeof formSchema>;

// Menu data
const menuItems: MenuItem[] = [
  // Soups
  {
    id: "soup-tomato",
    name: "Zupa pomidorowa",
    description: "Kremowa zupa z świeżymi pomidorami",
    price: 15,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "soup"
  },
  {
    id: "soup-broth",
    name: "Rosół z makaronem",
    description: "Tradycyjny rosół z kurczaka",
    price: 18,
    image: "https://images.unsplash.com/photo-1613564834361-9436948817d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "soup"
  },
  {
    id: "soup-mushroom",
    name: "Zupa grzybowa",
    description: "Kremowa z leśnymi grzybami",
    price: 20,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "soup"
  },
  {
    id: "soup-zurek",
    name: "Żurek",
    description: "Z białą kiełbasą i jajkiem",
    price: 16,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "soup"
  },
  {
    id: "soup-broccoli",
    name: "Zupa brokułowa",
    description: "Zdrowa i pożywna",
    price: 17,
    image: "https://images.unsplash.com/photo-1571197919849-0d582c7fb673?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "soup"
  },
  // Main dishes
  {
    id: "main-chicken",
    name: "Pierś z kurczaka grillowana",
    description: "Z ziołami i warzywami",
    price: 35,
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "main"
  },
  {
    id: "main-beef",
    name: "Stek wołowy",
    description: "Z sosem pieprzowym",
    price: 45,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "main"
  },
  {
    id: "main-salmon",
    name: "Łosoś grillowany",
    description: "Ze szparagami",
    price: 40,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "main"
  },
  {
    id: "main-pierogi",
    name: "Pierogi ruskie",
    description: "Z twarogiem i ziemniakami",
    price: 32,
    image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "main"
  },
  {
    id: "main-pork",
    name: "Polędwica wieprzowa",
    description: "W sosie grzybowym",
    price: 38,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "main"
  },
  // Desserts
  {
    id: "dessert-tiramisu",
    name: "Tiramisu",
    description: "Klasyczny włoski deser",
    price: 12,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "dessert"
  },
  {
    id: "dessert-chocolate",
    name: "Czekoladowe lava cake",
    description: "Z lodami waniliowymi",
    price: 14,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "dessert"
  },
  {
    id: "dessert-cheesecake",
    name: "Sernik",
    description: "Tradycyjny z owocami",
    price: 10,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "dessert"
  },
  {
    id: "dessert-tart",
    name: "Tarta owocowa",
    description: "Sezonowe owoce",
    price: 11,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "dessert"
  },
  {
    id: "dessert-panna",
    name: "Panna cotta",
    description: "Z sosem jagodowym",
    price: 13,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
    category: "dessert"
  },
];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState<number>(1);
  const [deliveryDays, setDeliveryDays] = useState<DeliveryDay[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      specialInstructions: "",
      deliveryDays: [],
      subtotal: 0,
      deliveryFee: 0,
      total: 0,
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const subtotal = deliveryDays.reduce((sum, day) => 
        sum + (day.selectedItems.reduce((daySum, item) => daySum + item.price, 0) * day.numberOfPeople), 0
      );
      const deliveryFee = deliveryDays.length > 0 ? 10 * deliveryDays.length : 0;
      const total = subtotal + deliveryFee;

      const orderData = {
        ...data,
        deliveryDays,
        subtotal,
        deliveryFee,
        total,
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Zamówienie złożone!",
        description: "Dziękujemy za wybór naszego kateringu. Skontaktujemy się z Państwem wkrótce.",
      });
      reset();
      setDeliveryDays([]);
      setCurrentStep(0);
      setNumberOfDays(1);
      setCurrentDayIndex(0);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.",
      });
    },
  });

  const handleItemSelection = (item: MenuItem, selected: boolean) => {
    setDeliveryDays(prev => {
      const updated = [...prev];
      if (!updated[currentDayIndex]) return prev;
      
      if (selected) {
        updated[currentDayIndex] = {
          ...updated[currentDayIndex],
          selectedItems: [...updated[currentDayIndex].selectedItems, {
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
          }]
        };
      } else {
        updated[currentDayIndex] = {
          ...updated[currentDayIndex],
          selectedItems: updated[currentDayIndex].selectedItems.filter(selectedItem => selectedItem.id !== item.id)
        };
      }
      return updated;
    });
  };

  const onSubmit = (data: FormData) => {
    const allDaysHaveItems = deliveryDays.every(day => day.selectedItems.length > 0);
    if (!allDaysHaveItems) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Proszę wybrać przynajmniej jedno danie dla każdego dnia",
      });
      return;
    }
    createOrderMutation.mutate(data);
  };

  const soups = menuItems.filter(item => item.category === 'soup');
  const mains = menuItems.filter(item => item.category === 'main');
  const desserts = menuItems.filter(item => item.category === 'dessert');

  const steps = [
    { id: 'days', title: 'Liczba dni', icon: Hash },
    { id: 'dates', title: 'Wybierz daty', icon: Calendar },
    { id: 'menu', title: 'Menu', icon: Utensils },
    { id: 'customer', title: 'Dane klienta', icon: User },
  ];

  const nextStep = () => {
    if (currentStep === 0) {
      // Initialize delivery days when moving from day count selection
      const newDeliveryDays: DeliveryDay[] = Array.from({ length: numberOfDays }, () => ({
        date: '',
        numberOfPeople: 1,
        selectedItems: []
      }));
      setDeliveryDays(newDeliveryDays);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const nextDay = () => {
    if (currentDayIndex < deliveryDays.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const prevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const updateDeliveryDate = (dayIndex: number, date: string) => {
    setDeliveryDays(prev => {
      const updated = [...prev];
      if (updated[dayIndex]) {
        updated[dayIndex] = { ...updated[dayIndex], date };
      }
      return updated;
    });
  };

  const updateNumberOfPeople = (dayIndex: number, numberOfPeople: number) => {
    setDeliveryDays(prev => {
      const updated = [...prev];
      if (updated[dayIndex]) {
        updated[dayIndex] = { ...updated[dayIndex], numberOfPeople };
      }
      return updated;
    });
  };

  const isStepValid = () => {
    if (currentStep === 0) return numberOfDays >= 1 && numberOfDays <= 7;
    if (currentStep === 1) return deliveryDays.length === numberOfDays && 
      deliveryDays.every(day => day.date && day.numberOfPeople >= 1 && day.numberOfPeople <= 500);
    if (currentStep === 2) {
      // Allow progression through menu selection - final validation happens on submit
      return deliveryDays.length > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Utensils className="text-primary-foreground text-lg h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Nowoczesny Katering</h1>
                <p className="text-sm text-muted-foreground">Zamówienia online</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <span className="text-sm text-muted-foreground flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                +48 123 456 789
              </span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                zamowienia@katering.pl
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            <Card className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Formularz Zamówień Kateringowych
                </h2>
                <p className="text-muted-foreground">
                  Wybierz swoje ulubione dania z naszego menu - krok {currentStep + 1} z {steps.length}
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    return (
                      <div key={step.id} className="flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          isActive 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : isCompleted 
                              ? 'bg-secondary border-secondary text-secondary-foreground'
                              : 'border-border text-muted-foreground'
                        }`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span className={`ml-2 text-sm font-medium ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </span>
                        {index < steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step Content */}
                <div className="min-h-[400px]">
                  {/* Step 0: Number of Days */}
                  {currentStep === 0 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                        <Hash className="text-primary mr-3 h-6 w-6" />
                        Wybierz liczbę dni
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Na ile dni chcesz zamówić catering? (maksymalnie 7 dni)
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={numberOfDays === day ? "default" : "outline"}
                            className="h-16 text-lg font-semibold"
                            onClick={() => setNumberOfDays(day)}
                            data-testid={`button-days-${day}`}
                          >
                            {day} {day === 1 ? 'dzień' : 'dni'}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Date Selection */}
                  {currentStep === 1 && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                        <Calendar className="text-primary mr-3 h-6 w-6" />
                        Wybierz daty dostaw
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Wybierz konkretne daty dla {numberOfDays} {numberOfDays === 1 ? 'dnia' : 'dni'} kateringu
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {deliveryDays.map((day, index) => (
                          <div key={index} className="p-4 border border-border rounded-lg">
                            <Label htmlFor={`delivery-date-${index}`} className="block text-sm font-medium text-foreground mb-2">
                              Dzień {index + 1}
                            </Label>
                            <div className="space-y-3">
                              <Input
                                id={`delivery-date-${index}`}
                                type="date"
                                value={day.date}
                                onChange={(e) => updateDeliveryDate(index, e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                data-testid={`input-delivery-date-${index}`}
                              />
                              <div>
                                <Label htmlFor={`numberOfPeople-${index}`} className="block text-sm font-medium text-foreground mb-1">
                                  Liczba osób:
                                </Label>
                                <Input
                                  id={`numberOfPeople-${index}`}
                                  type="number"
                                  min="1"
                                  max="500"
                                  value={day.numberOfPeople}
                                  onChange={(e) => updateNumberOfPeople(index, parseInt(e.target.value) || 1)}
                                  data-testid={`input-numberOfPeople-${index}`}
                                  className="w-24"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Menu Selection */}
                  {currentStep === 2 && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-foreground flex items-center">
                          <Utensils className="text-primary mr-3 h-6 w-6" />
                          Menu dla dnia {currentDayIndex + 1}
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {deliveryDays[currentDayIndex]?.date && (
                            <span>Data: {new Date(deliveryDays[currentDayIndex].date).toLocaleDateString('pl-PL')}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Day Navigation */}
                      <div className="flex items-center justify-between mb-6 p-4 bg-accent rounded-lg">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={prevDay}
                          disabled={currentDayIndex === 0}
                          data-testid="button-prev-day"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Poprzedni dzień
                        </Button>
                        <span className="font-medium">
                          Dzień {currentDayIndex + 1} z {deliveryDays.length}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={nextDay}
                          disabled={currentDayIndex === deliveryDays.length - 1}
                          data-testid="button-next-day"
                        >
                          Następny dzień
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      {/* Menu Categories */}
                      <div className="space-y-8">
                        {/* Soups */}
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <Soup className="text-primary mr-2 h-5 w-5" />
                            Zupy
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {soups.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                isSelected={deliveryDays[currentDayIndex]?.selectedItems.some(selected => selected.id === item.id) || false}
                                onSelectionChange={(selected) => handleItemSelection(item, selected)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Main Dishes */}
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <UtensilsCrossed className="text-primary mr-2 h-5 w-5" />
                            Dania główne
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mains.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                isSelected={deliveryDays[currentDayIndex]?.selectedItems.some(selected => selected.id === item.id) || false}
                                onSelectionChange={(selected) => handleItemSelection(item, selected)}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Desserts */}
                        <div>
                          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                            <IceCream className="text-primary mr-2 h-5 w-5" />
                            Desery
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {desserts.map((item) => (
                              <MenuItemCard
                                key={item.id}
                                item={item}
                                isSelected={deliveryDays[currentDayIndex]?.selectedItems.some(selected => selected.id === item.id) || false}
                                onSelectionChange={(selected) => handleItemSelection(item, selected)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Customer Information */}
                  {currentStep === 3 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <User className="text-primary mr-2 h-5 w-5" />
                        Informacje o kliencie
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <Label htmlFor="customerName" className="block text-sm font-medium text-foreground mb-2">
                            Imię i nazwisko *
                          </Label>
                          <Input
                            {...register("customerName")}
                            id="customerName"
                            data-testid="input-customer-name"
                          />
                          {errors.customerName && (
                            <p className="text-destructive text-sm mt-1" data-testid="error-customer-name">
                              {errors.customerName.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="customerPhone" className="block text-sm font-medium text-foreground mb-2">
                            Telefon *
                          </Label>
                          <Input
                            {...register("customerPhone")}
                            id="customerPhone"
                            type="tel"
                            data-testid="input-customer-phone"
                          />
                          {errors.customerPhone && (
                            <p className="text-destructive text-sm mt-1" data-testid="error-customer-phone">
                              {errors.customerPhone.message}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="customerEmail" className="block text-sm font-medium text-foreground mb-2">
                            Email *
                          </Label>
                          <Input
                            {...register("customerEmail")}
                            id="customerEmail"
                            type="email"
                            data-testid="input-customer-email"
                          />
                          {errors.customerEmail && (
                            <p className="text-destructive text-sm mt-1" data-testid="error-customer-email">
                              {errors.customerEmail.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delivery Summary */}
                      <div className="mb-6 p-4 bg-accent rounded-lg">
                        <h4 className="text-lg font-semibold text-foreground mb-3">
                          Podsumowanie dostaw
                        </h4>
                        <div className="space-y-2">
                          {deliveryDays.map((day, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-sm text-foreground">
                                Dzień {index + 1}: {day.date ? new Date(day.date).toLocaleDateString('pl-PL') : 'Brak daty'}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {day.selectedItems.length} {day.selectedItems.length === 1 ? 'danie' : 'dań'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Instructions */}
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                          <StickyNote className="text-primary mr-2 h-5 w-5" />
                          Uwagi specjalne
                        </h4>
                        <Textarea
                          {...register("specialInstructions")}
                          id="specialInstructions"
                          rows={4}
                          placeholder="Dodatkowe informacje, alergie, preferencje dietetyczne..."
                          className="resize-none"
                          data-testid="textarea-special-instructions"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    data-testid="button-previous"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Poprzedni krok
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Krok {currentStep + 1} z {steps.length}
                  </div>

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid()}
                      data-testid="button-next"
                    >
                      Następny krok
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 font-semibold"
                      disabled={createOrderMutation.isPending}
                      data-testid="button-submit-order"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {createOrderMutation.isPending ? "Składanie zamówienia..." : "Złóż zamówienie"}
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary deliveryDays={deliveryDays} />
          </div>
        </div>
      </main>
    </div>
  );
}
