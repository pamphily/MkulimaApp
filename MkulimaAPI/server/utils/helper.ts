import { InvariantError } from "../exceptions/InvariantError";

interface helperPayload {
  amountPaid: number, 
  ppu: number,
  rate?: number,
  hasLoan: boolean
}

export const calculateTokenValues = ( payload: helperPayload ) => {
  if (payload.ppu === 0 || payload.ppu === null){
    new InvariantError("Please set price per unit")
  }
    if (payload.hasLoan) {
      const effectiveRate = (100 - payload.rate) / 100;
      const tokenAmount = payload.amountPaid * effectiveRate;
      return {
        tokenAmount,
        tokenUnits: tokenAmount / payload.ppu
      };
    }
    return {
      tokenAmount: payload.amountPaid,
      tokenUnits: payload.amountPaid / payload.ppu
    };
  };


 
  