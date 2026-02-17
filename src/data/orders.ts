export interface Order {
  id: number;
  client: string;       // Full name: "OpenAI", "Anthropic"
  displayName: string;  // Short display: "OAI", "A"
  orderName: string;    // Order identifier: "OAI-01", "A-01"
  problemCount: number; // Number of problems in the order
  dueDate: Date;
  deliveredDate: Date | null;
  completed: boolean;
}

// Manually maintained orders list
// Update this when order status changes
export const orders: Order[] = [
  { id: 1, client: 'OpenAI', displayName: 'OAI', orderName: 'OAI-01', problemCount: 10, dueDate: new Date(2026, 1, 12), deliveredDate: new Date(2026, 1, 11), completed: true },
  { id: 2, client: 'Anthropic', displayName: 'A', orderName: 'A-01', problemCount: 10, dueDate: new Date(2026, 1, 19), deliveredDate: null, completed: false },
];
