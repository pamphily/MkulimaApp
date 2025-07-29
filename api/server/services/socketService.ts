// service/socketService.ts
type Message = {
    from: string;
    to: string;
    content: string;
  };
  
  export const socketService = {
    async saveMessage({ from, to, content }: Message) {
      // Replace with actual DB logic (e.g., Prisma or SQL)
      console.log(`Saving message: ${from} -> ${to}: ${content}`);
    },

    
  };
  