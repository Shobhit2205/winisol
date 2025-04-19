'use client';

import React from "react";
import { LimitedLottery, Lottery } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import SolanaExplorerLink from "@/components/ui/common/SolanaExplorerLink";

type lotteryType = "limited" | "regular";
interface LotteryTableProps {
  lottery: Lottery | LimitedLottery | undefined;
  lotteryType: lotteryType;
}

const LotteryTable: React.FC<LotteryTableProps> = ({ lottery, lotteryType }) => {
  return (
    <div className="w-full p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Lottery Details</h2>

      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Lottery Id</TableCell>
            <TableCell>{lottery?.id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Lottery Name</TableCell>
            <TableCell>{lottery?.lotteryName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-[20%]">Lottery Symbol</TableCell>
            <TableCell className="w-[80%]">{lottery?.lotterySymbol}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="w-[20%]">Lottery URI</TableCell>
            <TableCell className="w-[80%]">
              <a href={lottery?.lotteryURI} target="_blank" rel="noopener noreferrer" className="text-primary underline flex gap-2">
                {lottery?.lotteryURI}
              </a>
            </TableCell>
          </TableRow>
          {lotteryType === "regular" && <TableRow>
            <TableCell>Start Time</TableCell>
            <TableCell>{lotteryType === "regular" && lottery ? new Date((lottery as Lottery).startTime * 1000).toLocaleString() : "N/A"}</TableCell>
          </TableRow>}
          {lotteryType === "regular" && <TableRow>
            <TableCell>End Time</TableCell>
            <TableCell>{lotteryType === "regular" && lottery ? new Date((lottery as Lottery).endTime * 1000).toLocaleString() : "N/A"}</TableCell>
          </TableRow>}
          {lotteryType === "limited" && <TableRow>
            <TableCell>Number of ticket sold</TableCell>
            <TableCell>{lotteryType === "limited" && (lottery as LimitedLottery)?.numberOfTicketSold}</TableCell>
          </TableRow>}
          <TableRow>
            <TableCell>Price</TableCell>
            <TableCell>{(lottery?.price || 0) / LAMPORTS_PER_SOL} SOL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Pot Amount</TableCell>
            <TableCell>{(lotteryType === "regular" ? (lottery as Lottery)?.potAmount : (lottery as LimitedLottery)?.totalPotAmount) / LAMPORTS_PER_SOL} SOL</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total Tickets</TableCell>
            <TableCell>{lottery?.totalTickets}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Winner Chosen</TableCell>
            <TableCell>
              <Badge className={`${lottery?.winnerChosen ? "bg-primary text-black" : " bg-red-500"} ring-0 px-4`}>
                {lottery?.winnerChosen ? "Yes" : "No"}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Winner Declared Time</TableCell>
            <TableCell>{lottery?.winnerChosen ? new Date(lottery?.winnerDeclaredTime).toLocaleString() : "N/A"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Winner Public Key</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.winnerPublicKey} label="Winner public key" type="address" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Winner Ticket Id</TableCell>
            <TableCell>{lottery?.winnerTicketId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SB Randomness PubKey</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.sbRandomnessPubKey} label="SB randomness public key" type="address" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>SB Queue PubKey</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.sbQueuePubKey} label="sbQueue public queue" type="address" />
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell>Initialize Config Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.initializeConfigSignature} label="Config" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Initialize Lottery Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.initializeLotterySignature} label="Lottery Init" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Create Randomness Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.createRandomnessSignature} label="Randomness" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Commit Randomness Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.commitRandomnessSignature} label="Commit Randomness" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Reveal Winner Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.revealWinnerSignature} label="Reveal Winner" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price Claimed</TableCell>
            <TableCell>
              <Badge className={`${lottery?.priceClaimed ? "bg-primary text-black" : " bg-red-500"} ring-0 px-4`}>
                {lottery?.priceClaimed ? "Yes" : "No"}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price Claimed Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.priceClaimedSignature} label="Claim" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Price Claimed Time</TableCell>
            <TableCell>
              {lottery?.priceClaimed ? new Date(lottery?.priceClaimedTime).toLocaleString() : "N/A"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Authority claimed prize</TableCell>
            <TableCell>
              <Badge className={`${lottery?.authorityPriceClaimed ? "bg-primary text-black" : " bg-red-500"} ring-0 px-4`}>
                {lottery?.authorityPriceClaimed ? "Yes" : "No"}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Authority Price Claimed Signature</TableCell>
            <TableCell>
              <SolanaExplorerLink signature={lottery?.authorityPriceClaimedSignature} label="Authority price claimed signature" type="transaction" />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Authority price Claimed Time</TableCell>
            <TableCell>
              {lottery?.authorityPriceClaimed ? new Date(lottery?.authorityPriceClaimedTime).toLocaleString() : "N/A"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Created At</TableCell>
            <TableCell>{new Date(lottery?.createdAt || Date.now()).toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default LotteryTable;
