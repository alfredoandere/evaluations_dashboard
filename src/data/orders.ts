export interface Order {
  id: number;
  client: string;       // Full name: "OpenAI", "Anthropic"
  displayName: string;  // Short display: "OAI", "A"
  problemCount: number; // Number of problems in the order
  dueDate: Date;
  completed: boolean;
}

// Manually maintained orders list
// Update this when order status changes
export const orders: Order[] = [
  { id: 1, client: 'OpenAI', displayName: 'OAI', problemCount: 10, dueDate: new Date(2026, 1, 12), completed: true },
  { id: 2, client: 'Anthropic', displayName: 'A', problemCount: 10, dueDate: new Date(2026, 1, 19), completed: false },
];
