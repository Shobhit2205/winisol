// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import WinisolIDL from '../target/idl/winisol.json'
import type { Winisol } from '../target/types/winisol'

// Re-export the generated IDL and type
export { Winisol, WinisolIDL }

// The programId is imported from the program IDL.
export const WINISOL_PROGRAM_ID = new PublicKey(WinisolIDL.address)

// This is a helper function to get the Winisol Anchor program.
export function getWinisolProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...WinisolIDL, address: address ? address.toBase58() : WinisolIDL.address } as Winisol, provider)
}

// This is a helper function to get the program ID for the Winisol program depending on the cluster.
export function getWinisolProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Winisol program on devnet and testnet.
      return new PublicKey('4ZtREdydF64stX6X8UUweVMwCGKBJ1pjwAdNYhzBWEzo')
    case 'mainnet-beta':
    default:
      return WINISOL_PROGRAM_ID
  }
}
