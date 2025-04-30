#![allow(clippy::result_large_err)]

use std::str::FromStr;

use anchor_lang::prelude::*;
use anchor_spl::{ 
  associated_token::AssociatedToken, 
  metadata::{
    create_master_edition_v3, create_metadata_accounts_v3, mpl_token_metadata::types::{ 
      CollectionDetails, 
      Creator, 
      DataV2
    }, set_and_verify_sized_collection_item, sign_metadata, CreateMasterEditionV3, CreateMetadataAccountsV3, Metadata, MetadataAccount, SetAndVerifySizedCollectionItem, SignMetadata
  }, 
  token_interface::{
    mint_to, Mint, MintTo, TokenAccount, TokenInterface
  }
};
use anchor_lang::system_program;
use switchboard_on_demand::accounts::RandomnessAccountData;

declare_id!("4ZtREdydF64stX6X8UUweVMwCGKBJ1pjwAdNYhzBWEzo");

#[constant]
pub const AUTHORITY: &str = "RJtnLDyB6pZUWDZ7qZE8nCakas6eaofnqKyBDB7Xf1A";


#[program]
pub mod winisol {
  use super::*;

  pub fn initialize_config(ctx: Context<InitializeConifg>, lottery_id: u32, lottery_name: String, symbol: String, uri: String, start: u32, end: u32, price: u64) -> Result<()> {

    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Initialize Config");
    // let token_lottery = &mut ctx.accounts.token_lottery.load_mut()?;
    ctx.accounts.token_lottery.bump = ctx.bumps.token_lottery;
    ctx.accounts.token_lottery.lottery_id = lottery_id;
    ctx.accounts.token_lottery.lottery_name = lottery_name;
    ctx.accounts.token_lottery.symbol = symbol;
    ctx.accounts.token_lottery.uri = uri;
    ctx.accounts.token_lottery.lottery_start = start;
    ctx.accounts.token_lottery.lottery_end = end;
    ctx.accounts.token_lottery.price = price;
    ctx.accounts.token_lottery.authority = ctx.accounts.payer.key();
    ctx.accounts.token_lottery.randomness_account = Pubkey::default();
    ctx.accounts.token_lottery.lottery_pot_amount = 0;
    ctx.accounts.token_lottery.winner_claimed_winnings = false;
    ctx.accounts.token_lottery.authority_claimed_share = false;
    ctx.accounts.token_lottery.total_tickets = 0;
    ctx.accounts.token_lottery.winner_chosen = false;
    Ok(())
  }

  pub fn initialize_limited_lottery_config(ctx: Context<InitializeLimitedLotteryConfig>, lottery_id: u32, lottery_name: String, symbol: String, uri: String, price: u64, total_tickets: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Initialize Limited Lottery Config");
    ctx.accounts.limited_lottery.bump = ctx.bumps.limited_lottery;
    ctx.accounts.limited_lottery.lottery_id = lottery_id;
    ctx.accounts.limited_lottery.lottery_name = lottery_name;
    ctx.accounts.limited_lottery.symbol = symbol;
    ctx.accounts.limited_lottery.uri = uri;
    ctx.accounts.limited_lottery.price = price;
    ctx.accounts.limited_lottery.total_tickets = total_tickets;
    ctx.accounts.limited_lottery.winner_claimed_winnings = false;
    ctx.accounts.limited_lottery.authority_claimed_share = false;
    ctx.accounts.limited_lottery.winner_chosen = false;
    ctx.accounts.limited_lottery.ticket_bought = vec![];
    ctx.accounts.limited_lottery.lottery_pot_amount = 0;
    ctx.accounts.limited_lottery.number_of_ticket_sold = 0;
    ctx.accounts.limited_lottery.randomness_account = Pubkey::default();
    ctx.accounts.limited_lottery.authority = ctx.accounts.payer.key();

    Ok(())
  }

  pub fn initialize_lottery(ctx: Context<InitializeLottery>, lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Initialize Lottery");

    let lottery_id_bytes = lottery_id.to_le_bytes();
    let ticket_name = format!("{} #{}-{}", ctx.accounts.token_lottery.lottery_name, ctx.accounts.token_lottery.lottery_id, ctx.accounts.token_lottery.total_tickets);
    // let lottery = &ctx.accounts.token_lottery;
    // let name = &ctx.accounts.token_lottery. 
    // let token_lottery = &ctx.accounts.token_lottery.load()?;

    let signer_seeds: &[&[&[u8]]] = &[&[
      b"collection_mint".as_ref(),
      lottery_id_bytes.as_ref(),
      &[ctx.bumps.collection_mint]
    ]];

    msg!("creating mint account");
    mint_to(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), 
        MintTo {
          mint: ctx.accounts.collection_mint.to_account_info(),
          to: ctx.accounts.collection_token_account.to_account_info(),
          authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        signer_seeds
      ),
      1
    )?;


    msg!("creating metadata account");
    create_metadata_accounts_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMetadataAccountsV3 {
          metadata: ctx.accounts.metadata.to_account_info(),
          mint: ctx.accounts.collection_mint.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          payer: ctx.accounts.payer.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        &signer_seeds
      ), 
      DataV2 {
        name: ticket_name,
        symbol: ctx.accounts.token_lottery.symbol.to_string(),
        uri: ctx.accounts.token_lottery.uri.to_string(),
        seller_fee_basis_points: 0,
        creators: Some(vec![Creator {
          address: ctx.accounts.collection_mint.key(),
          verified: false,
          share: 100
        }]),
        collection: None,
        uses: None
      }, 
      true, 
      true, 
      Some(CollectionDetails::V1 { size: 0 })
    )?;

    msg!("Creating Master edition account");
    create_master_edition_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMasterEditionV3 {
          payer: ctx.accounts.payer.to_account_info(),
          mint: ctx.accounts.collection_mint.to_account_info(),
          edition: ctx.accounts.master_edition.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.metadata.to_account_info(),
          token_program: ctx.accounts.token_program.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
        }, 
        &signer_seeds
      ), 
      Some(0)
    )?;

    msg!("Verifying collection");
    sign_metadata(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        SignMetadata {
          creator: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.metadata.to_account_info(),
        }, 
        &signer_seeds)
    )?;

    Ok(())
  }
  
  pub fn buy_tickets(ctx: Context<BuyTicket>, lottery_id: u32) -> Result<()> {
    let clock = Clock::get()?;
    // let token_lottery = &mutctx.accounts.token_lottery;
    // let account = &ctx.accounts.token_lottery.load()?;
    // let ticket_name = NAME.to_owned().to_string() + ctx.accounts.token_lottery.total_tickets.to_string().as_str();
    let ticket_name = format!("{} #{}-{}", ctx.accounts.token_lottery.lottery_name, ctx.accounts.token_lottery.lottery_id, ctx.accounts.token_lottery.total_tickets);
    // let ticket_name = format!("{} {}", token_lottery.lottery_name, token_lottery.total_tickets);

    msg!("Ticket Id : {}", ticket_name);
    if clock.unix_timestamp < ctx.accounts.token_lottery.lottery_start as i64 || clock.unix_timestamp > ctx.accounts.token_lottery.lottery_end as i64 {
      return Err(ErrorCode::LotteryNotOpen.into());
    }

    system_program::transfer(
      CpiContext::new(
        ctx.accounts.system_program.to_account_info(), 
        system_program::Transfer { 
          from: ctx.accounts.payer.to_account_info(), 
          to: ctx.accounts.token_lottery.to_account_info(), 
        }
      ), 
      ctx.accounts.token_lottery.price as u64,
    )?;

    ctx.accounts.token_lottery.lottery_pot_amount += ctx.accounts.token_lottery.price as u64;

    let lottery_id_bytes = lottery_id.to_le_bytes();

    let signer_seeds: &[&[&[u8]]] = &[&[
      b"collection_mint".as_ref(),
      lottery_id_bytes.as_ref(),
      &[ctx.bumps.collection_mint],
    ]];

    mint_to(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), 
        MintTo {
          mint: ctx.accounts.ticket_mint.to_account_info(),
          to: ctx.accounts.destination.to_account_info(),
          authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        &signer_seeds
      ), 
      1,
    )?;

    msg!("creating metadata account");
    create_metadata_accounts_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMetadataAccountsV3 {
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          mint: ctx.accounts.ticket_mint.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          payer: ctx.accounts.payer.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        &signer_seeds
      ), 
      DataV2 {
        name: ticket_name.to_string(),
        symbol: ctx.accounts.token_lottery.symbol.to_string(),
        uri: ctx.accounts.token_lottery.uri.to_string(),
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None
      }, 
      true, 
      true, 
      None
    )?;

    msg!("Creating Master edition account");
    create_master_edition_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMasterEditionV3 {
          payer: ctx.accounts.payer.to_account_info(),
          mint: ctx.accounts.ticket_mint.to_account_info(),
          edition: ctx.accounts.ticket_master_edition.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          token_program: ctx.accounts.token_program.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
        }, 
        &signer_seeds
      ), 
      Some(0)
    )?;

    set_and_verify_sized_collection_item(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        SetAndVerifySizedCollectionItem{
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          collection_authority: ctx.accounts.collection_mint.to_account_info(),
          payer: ctx.accounts.payer.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          collection_mint: ctx.accounts.collection_mint.to_account_info(),
          collection_metadata: ctx.accounts.collection_metadata.to_account_info(),
          collection_master_edition: ctx.accounts.collection_master_edition.to_account_info(),
        }, 
        signer_seeds
      ), 
      None
    )?;

    ctx.accounts.token_lottery.total_tickets += 1;

    Ok(())
  }


  pub fn initialize_limited_lottery(ctx: Context<InitializeLimitedLottery>, lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Initialize Limited Lottery");

    let lottery_id_bytes = lottery_id.to_le_bytes();
    // let ticket_name = format!("{} #{}-{}", ctx.accounts.limited_lottery.lottery_name, ctx.accounts.limited_lottery.lottery_id, ctx.accounts.limited_lottery.number_of_ticket_sold);
    let collection_name = format!("{} Collection", ctx.accounts.limited_lottery.lottery_name);

    let signer_seeds: &[&[&[u8]]] = &[&[
      b"collection_mint".as_ref(),
      b"limited_lottery".as_ref(),
      lottery_id_bytes.as_ref(),
      &[ctx.bumps.collection_mint]
    ]];

    msg!("Minting initial collection token");
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.collection_mint.to_account_info(),
                to: ctx.accounts.collection_token_account.to_account_info(),
                authority: ctx.accounts.collection_mint.to_account_info(),
            },
            signer_seeds
        ),
        1 
    )?;

    msg!("Creating Metadata Account");
    create_metadata_accounts_v3(
        CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata.to_account_info(),
                mint: ctx.accounts.collection_mint.to_account_info(),
                mint_authority: ctx.accounts.collection_mint.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                update_authority: ctx.accounts.collection_mint.to_account_info(),
            },
            signer_seeds
        ),
        DataV2 {
            name: collection_name,
            symbol: ctx.accounts.limited_lottery.symbol.clone(),
            uri: ctx.accounts.limited_lottery.uri.clone(),
            seller_fee_basis_points: 0,
            creators: Some(vec![Creator {
                address: ctx.accounts.collection_mint.key(),
                verified: false,
                share: 100
            }]),
            collection: None,
            uses: None
        },
        true,  // Is mutable
        true,  // Update authority is signer
        Some(CollectionDetails::V1 { size: 0 })
    )?;

    msg!("Creating Master edition account");
    create_master_edition_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMasterEditionV3 {
          payer: ctx.accounts.payer.to_account_info(),
          mint: ctx.accounts.collection_mint.to_account_info(),
          edition: ctx.accounts.master_edition.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.metadata.to_account_info(),
          token_program: ctx.accounts.token_program.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
        }, 
        &signer_seeds
      ), 
      Some(0)
    )?;

    msg!("Verifying collection");
    sign_metadata(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        SignMetadata {
          creator: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.metadata.to_account_info(),
        }, 
        &signer_seeds)
    )?;


    Ok(())
  }

  pub fn buy_limited_lottery_tickets( ctx: Context<BuyLimitedLotteryTickets>, lottery_id: u32, ticket_number: u32,) -> Result<()> {

    let limited_lottery = &mut ctx.accounts.limited_lottery;
    
    if ticket_number < 1 || ticket_number > limited_lottery.total_tickets {
        return Err(ErrorCode::InvalidTicketNumber.into());
    }
    
    // Check if ticket was already bought
    if limited_lottery.ticket_bought.contains(&(ticket_number as u16)) {
        return Err(ErrorCode::TicketAlreadySold.into());
    }

    let total_price = limited_lottery.price.checked_add(
      limited_lottery.price.checked_div(10).ok_or(ErrorCode::MathOverflow)?
    ).ok_or(ErrorCode::MathOverflow)?;

    // Transfer payment from user to lottery pool
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: limited_lottery.to_account_info(),
            },
        ),
        total_price,
    )?;

    limited_lottery.lottery_pot_amount += total_price as u64;
    limited_lottery.ticket_bought.push(ticket_number as u16);

    let ticket_name = format!("{} #{}-{}", limited_lottery.lottery_name, limited_lottery.lottery_id, ticket_number);

    msg!("Ticket Id : {}", ticket_name);

    let lottery_id_bytes = lottery_id.to_le_bytes();
    let signer_seeds: &[&[&[u8]]] = &[&[
      b"collection_mint".as_ref(),
      b"limited_lottery".as_ref(),
      lottery_id_bytes.as_ref(),
      &[ctx.bumps.collection_mint],
    ]];

    mint_to(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(), 
        MintTo {
          mint: ctx.accounts.ticket_mint.to_account_info(),
          to: ctx.accounts.destination.to_account_info(),
          authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        &signer_seeds
      ), 
      1,
    )?;

    msg!("creating metadata account");
    create_metadata_accounts_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMetadataAccountsV3 {
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          mint: ctx.accounts.ticket_mint.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          payer: ctx.accounts.payer.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
        }, 
        &signer_seeds
      ), 
      DataV2 {
        name: ticket_name.to_string(),
        symbol: limited_lottery.symbol.to_string(),
        uri: limited_lottery.uri.to_string(),
        seller_fee_basis_points: 0,
        creators: None,
        collection: None,
        uses: None
      }, 
      true, 
      true, 
      None
    )?;

    msg!("Creating Master edition account");
    create_master_edition_v3(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        CreateMasterEditionV3 {
          payer: ctx.accounts.payer.to_account_info(),
          mint: ctx.accounts.ticket_mint.to_account_info(),
          edition: ctx.accounts.ticket_master_edition.to_account_info(),
          mint_authority: ctx.accounts.collection_mint.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          token_program: ctx.accounts.token_program.to_account_info(),
          system_program: ctx.accounts.system_program.to_account_info(),
          rent: ctx.accounts.rent.to_account_info(),
        }, 
        &signer_seeds
      ), 
      Some(0)
    )?;

    set_and_verify_sized_collection_item(
      CpiContext::new_with_signer(
        ctx.accounts.token_metadata_program.to_account_info(), 
        SetAndVerifySizedCollectionItem{
          metadata: ctx.accounts.ticket_metadata.to_account_info(),
          collection_authority: ctx.accounts.collection_mint.to_account_info(),
          payer: ctx.accounts.payer.to_account_info(),
          update_authority: ctx.accounts.collection_mint.to_account_info(),
          collection_mint: ctx.accounts.collection_mint.to_account_info(),
          collection_metadata: ctx.accounts.collection_metadata.to_account_info(),
          collection_master_edition: ctx.accounts.collection_master_edition.to_account_info(),
        }, 
        signer_seeds
      ), 
      None
    )?;

    limited_lottery.number_of_ticket_sold += 1;

    Ok(())
  }

  pub fn commit_randomness(ctx: Context<CommitRandomness>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Commit Randomness");
    let clock = Clock::get()?;
    let token_lottery = &mut ctx.accounts.token_lottery;

    if ctx.accounts.payer.key() != token_lottery.authority{
      return Err(ErrorCode::NotAuthorized.into());
    }

    let randomness_data = RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();

    if randomness_data.seed_slot != clock.slot - 1 {
      return Err(ErrorCode::RandomnessAlreadyRevealed.into());
    }

    token_lottery.randomness_account = ctx.accounts.randomness_account.key();


    Ok(())
  }

  pub fn commit_limited_lottery_randomness(ctx: Context<CommitLimitedLotteryRandomness>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Commit Limited Lottery Randomness");
    let clock = Clock::get()?;
    let limited_lottery = &mut ctx.accounts.limited_lottery;

    if ctx.accounts.payer.key() != limited_lottery.authority{
      return Err(ErrorCode::NotAuthorized.into());
    }

    let randomness_data = RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();

    if randomness_data.seed_slot != clock.slot - 1 {
      return Err(ErrorCode::RandomnessAlreadyRevealed.into());
    }

    limited_lottery.randomness_account = ctx.accounts.randomness_account.key();
    Ok(())
  }

  pub fn reveal_winner(ctx: Context<RevealWinner>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Reveal Winner");

    let clock = Clock::get()?;
    let token_lottery = &mut ctx.accounts.token_lottery;

    if ctx.accounts.payer.key() != token_lottery.authority {
      return Err(ErrorCode::NotAuthorized.into());
    }

    if ctx.accounts.randomness_account.key() != token_lottery.randomness_account {
      return Err(ErrorCode::IncorrectRandomnessAccount.into());
    }

    if clock.unix_timestamp < token_lottery.lottery_end as i64 {
      return Err(ErrorCode::LotteryNotCompleted.into());
    }

    require!(!token_lottery.winner_chosen, ErrorCode::WinnerChosen);

    let randomness_data = RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();

    let reveal_random_value = randomness_data.get_value(&clock).map_err(|_| ErrorCode::RandomnessNotResolved)?;

    let winner = reveal_random_value[0] as u32 % token_lottery.total_tickets;
    let ticket = format!("{} #{}-{}", token_lottery.lottery_name, token_lottery.lottery_id, winner);
    msg!("Winner Ticket : {}", ticket);

    token_lottery.winner = winner;
    token_lottery.winner_chosen = true;

    Ok(())
  }

  pub fn reveal_limited_lottery_winner(ctx: Context<RevealLimitedLotteryWinner>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    msg!("Reveal Winner");

    let clock = Clock::get()?;
    let limited_lottery = &mut ctx.accounts.limited_lottery;

    if ctx.accounts.payer.key() != limited_lottery.authority {
      return Err(ErrorCode::NotAuthorized.into());
    }

    if ctx.accounts.randomness_account.key() != limited_lottery.randomness_account {
      return Err(ErrorCode::IncorrectRandomnessAccount.into());
    }

    if limited_lottery.number_of_ticket_sold < limited_lottery.total_tickets {
      return Err(ErrorCode::LotteryNotCompleted.into());
    }

    require!(!limited_lottery.winner_chosen, ErrorCode::WinnerChosen);

    let randomness_data = RandomnessAccountData::parse(ctx.accounts.randomness_account.data.borrow()).unwrap();

    let reveal_random_value = randomness_data.get_value(&clock).map_err(|_| ErrorCode::RandomnessNotResolved)?;

    let winner = (reveal_random_value[0] as u32 % limited_lottery.total_tickets) + 1;
    let ticket = format!("{} #{}-{}", limited_lottery.lottery_name, limited_lottery.lottery_id, winner);
    msg!("Winner Ticket : {}", ticket);

    limited_lottery.winner = winner;
    limited_lottery.winner_chosen = true;

    Ok(())
  }

  pub fn claim_winnings(ctx: Context<ClaimWinnings>, _lottery_id: u32) -> Result<()> {
    msg!("Claim Winnings");
    require!(ctx.accounts.token_lottery.winner_chosen, ErrorCode::WinnerNotChosen);
    require!(ctx.accounts.token_lottery.winner_claimed_winnings == false, ErrorCode::WinningsAlreadyClaimed);

    require!(ctx.accounts.ticket_metadata.collection.as_ref().unwrap().verified, ErrorCode::CollectionNotVerified);

    require!(ctx.accounts.ticket_metadata.collection.as_ref().unwrap().key == ctx.accounts.collection_mint.key(), ErrorCode::IncorrectTicket);

    let ticket_name = format!("{} #{}-{}", ctx.accounts.token_lottery.lottery_name, ctx.accounts.token_lottery.lottery_id, ctx.accounts.token_lottery.winner);

    msg!("Ticket Id : {}", ticket_name);

    let metadata_name = ctx.accounts.ticket_metadata.name.replace("\u{0}", "");

    require!(metadata_name == ticket_name, ErrorCode::IncorrectTicket);
    require!(ctx.accounts.ticket_account.amount > 0, ErrorCode::NoTicket);

    let current_pot = ctx.accounts.token_lottery.lottery_pot_amount;
    let winner_amount: u64;
    if ctx.accounts.token_lottery.authority_claimed_share == false {
      winner_amount = (current_pot * 90) / 100;
    }
    else {
      winner_amount = current_pot;
    }

    // Transfer 90% to the winner
    **ctx.accounts.token_lottery.to_account_info().lamports.borrow_mut() -= winner_amount;
    **ctx.accounts.payer.to_account_info().lamports.borrow_mut() += winner_amount;

    ctx.accounts.token_lottery.lottery_pot_amount -= winner_amount;
    ctx.accounts.token_lottery.winner_claimed_winnings = true;

    Ok(())
  }


  pub fn claim_limited_lottery_winnings(ctx: Context<ClaimLimitedLotteryWinnings>, _lottery_id: u32) -> Result<()> {
    msg!("Claim Limited Lottery Winnings");
    require!(ctx.accounts.limited_lottery.winner_chosen, ErrorCode::WinnerNotChosen);
    require!(ctx.accounts.limited_lottery.winner_claimed_winnings == false, ErrorCode::WinningsAlreadyClaimed);

    require!(ctx.accounts.ticket_metadata.collection.as_ref().unwrap().verified, ErrorCode::CollectionNotVerified);

    require!(ctx.accounts.ticket_metadata.collection.as_ref().unwrap().key == ctx.accounts.collection_mint.key(), ErrorCode::IncorrectTicket);

    let ticket_name = format!("{} #{}-{}", ctx.accounts.limited_lottery.lottery_name, ctx.accounts.limited_lottery.lottery_id, ctx.accounts.limited_lottery.winner);

    msg!("Ticket Id : {}", ticket_name);

    let metadata_name = ctx.accounts.ticket_metadata.name.replace("\u{0}", "");

    require!(metadata_name == ticket_name, ErrorCode::IncorrectTicket);
    require!(ctx.accounts.ticket_account.amount > 0, ErrorCode::NoTicket);

    let current_pot = ctx.accounts.limited_lottery.lottery_pot_amount;
    let winner_amount: u64;
    if ctx.accounts.limited_lottery.authority_claimed_share == false {
      winner_amount = ctx.accounts.limited_lottery.price.checked_mul(ctx.accounts.limited_lottery.number_of_ticket_sold as u64).ok_or(ErrorCode::MathOverflow)?;
    }
    else {
      winner_amount = current_pot;
    }

    **ctx.accounts.limited_lottery.to_account_info().lamports.borrow_mut() -= winner_amount;
    **ctx.accounts.payer.to_account_info().lamports.borrow_mut() += winner_amount;

    ctx.accounts.limited_lottery.lottery_pot_amount -= winner_amount;
    ctx.accounts.limited_lottery.winner_claimed_winnings = true;

    Ok(())
  }

  

  pub fn transfer_to_authority(ctx: Context<TransferToAuthority>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }
    require!(ctx.accounts.token_lottery.authority_claimed_share == false, ErrorCode::WinningsAlreadyClaimed);

    let current_pot = ctx.accounts.token_lottery.lottery_pot_amount;

    let authority_amount: u64;
    if ctx.accounts.token_lottery.winner_claimed_winnings == false {
      authority_amount = (current_pot * 10) / 100;
    }
    else {
      authority_amount = current_pot;
    }

    **ctx.accounts.token_lottery.to_account_info().lamports.borrow_mut() -= authority_amount;
    **ctx.accounts.payer.to_account_info().lamports.borrow_mut() += authority_amount;

    ctx.accounts.token_lottery.lottery_pot_amount = current_pot - authority_amount;
    ctx.accounts.token_lottery.authority_claimed_share = true;

    Ok(())
  }

  pub fn limited_lottery_transfer_to_authority(ctx: Context<LimitedLotteryTransferToAuthority>, _lottery_id: u32) -> Result<()> {
    if ctx.accounts.payer.key() != Pubkey::from_str(AUTHORITY).unwrap() {
      return Err(ErrorCode::UnauthorizedAdmin.into());
    }

    require!(ctx.accounts.limited_lottery.authority_claimed_share == false, ErrorCode::WinningsAlreadyClaimed);

    let current_pot = ctx.accounts.limited_lottery.lottery_pot_amount;

    let authority_amount: u64;
    if ctx.accounts.limited_lottery.winner_claimed_winnings == false {
      let calculated_amount = ctx.accounts.limited_lottery.price
          .checked_mul(ctx.accounts.limited_lottery.total_tickets as u64)
          .ok_or(ErrorCode::MathOverflow)?
          .checked_mul(10)
          .ok_or(ErrorCode::MathOverflow)?
          .checked_div(100)
          .ok_or(ErrorCode::MathOverflow)?;
        authority_amount = std::cmp::min(calculated_amount, current_pot);
    }
    else {
      authority_amount = current_pot;
    }

    **ctx.accounts.limited_lottery.to_account_info().lamports.borrow_mut() -= authority_amount;
    **ctx.accounts.payer.to_account_info().lamports.borrow_mut() += authority_amount;

    ctx.accounts.limited_lottery.lottery_pot_amount = current_pot - authority_amount;
    ctx.accounts.limited_lottery.authority_claimed_share = true;

    Ok(())
  }

}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct InitializeConifg<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
      init,
      payer = payer,
      space = 8 + TokenLottery::INIT_SPACE,
      seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
      bump
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct InitializeLimitedLotteryConfig<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
      init,
      payer = payer,
      space = 8 + LimitedLottery::INIT_SPACE,
      seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
      bump
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  pub system_program: Program<'info, System>,
}


#[account]
#[derive(InitSpace)]
pub struct TokenLottery {
  pub bump: u8,
  #[max_len(20)]
  pub lottery_name: String,
  #[max_len(5)]
  pub symbol: String,
  #[max_len(200)]
  pub uri: String,
  pub winner: u32,
  pub winner_chosen: bool,
  pub lottery_id: u32,
  pub lottery_start: u32,
  pub lottery_end: u32,
  pub lottery_pot_amount: u64,
  pub winner_claimed_winnings: bool,
  pub authority_claimed_share: bool,
  pub total_tickets: u32,
  pub price: u64,
  pub randomness_account: Pubkey,
  pub authority: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct LimitedLottery {
  pub bump: u8,
  #[max_len(20)]
  pub lottery_name: String,
  #[max_len(5)]
  pub symbol: String,
  #[max_len(200)]
  pub uri: String,
  pub lottery_id: u32,
  pub price: u64,
  pub total_tickets: u32,
  #[max_len(1000)]
  pub ticket_bought: Vec<u16>,
  pub number_of_ticket_sold: u32,
  pub lottery_pot_amount: u64,
  pub winner: u32,
  pub winner_chosen: bool,
  pub winner_claimed_winnings: bool,
  pub authority_claimed_share: bool,
  pub randomness_account: Pubkey,
  pub authority: Pubkey,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct InitializeLottery<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = token_lottery.bump,
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  #[account(
    init,
    payer = payer,
    mint::decimals = 0,
    mint::authority = collection_mint,
    mint::freeze_authority = collection_mint,
    seeds = [b"collection_mint".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub master_edition: UncheckedAccount<'info>,

  #[account(
    init,
    payer = payer,
    token::mint = collection_mint,
    token::authority = collection_token_account,
    seeds = [b"collection_associated_token".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_token_account: InterfaceAccount<'info, TokenAccount>,

  

  pub token_metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Interface<'info, TokenInterface>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct InitializeLimitedLottery<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = limited_lottery.bump,
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  #[account(
    init,
    payer = payer,
    mint::decimals = 0,
    mint::authority = collection_mint,
    mint::freeze_authority = collection_mint,
    seeds = [b"collection_mint".as_ref(), b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub master_edition: UncheckedAccount<'info>,

  #[account(
    init,
    payer = payer,
    token::mint = collection_mint,
    token::authority = collection_token_account,
    seeds = [b"collection_associated_token".as_ref(), b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_token_account: InterfaceAccount<'info, TokenAccount>,

  pub token_metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Interface<'info, TokenInterface>,
  pub rent: Sysvar<'info, Rent>,
  pub system_program: Program<'info, System>,

}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct BuyTicket<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = token_lottery.bump,
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  #[account(
    init, 
    payer = payer,
    seeds = [lottery_id.to_le_bytes().as_ref(), token_lottery.total_tickets.to_le_bytes().as_ref()],
    bump,
    mint::decimals = 0,
    mint::authority = collection_mint,
    mint::freeze_authority = collection_mint,
    mint::token_program = token_program,
  )]
  pub ticket_mint: InterfaceAccount<'info, Mint>,

  #[account(
    init,
    payer = payer,
    associated_token::mint = ticket_mint,
    associated_token::authority = payer,
    associated_token::token_program = token_program,
  )]
  pub destination: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub ticket_metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub ticket_master_edition: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub collection_metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub collection_master_edition: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"collection_mint".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,
  pub token_metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Interface<'info, TokenInterface>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,

}

#[derive(Accounts)]
#[instruction(lottery_id: u32, ticket_number: u32)]
pub struct BuyLimitedLotteryTickets<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = limited_lottery.bump,
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  #[account(
    init, 
    payer = payer,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref(), ticket_number.to_le_bytes().as_ref()],
    bump,
    mint::decimals = 0,
    mint::authority = collection_mint,
    mint::freeze_authority = collection_mint,
    mint::token_program = token_program,
  )]
  pub ticket_mint: InterfaceAccount<'info, Mint>,

  #[account(
    init,
    payer = payer,
    associated_token::mint = ticket_mint,
    associated_token::authority = payer,
    associated_token::token_program = token_program,
  )]
  pub destination: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub ticket_metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub ticket_master_edition: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub collection_metadata: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref(), b"edition"],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  /// CHECK: This account is checked by metadata smart contract
  pub collection_master_edition: UncheckedAccount<'info>,

  #[account(
    mut,
    seeds = [b"collection_mint".as_ref(), b"limited_lottery".as_ref() , lottery_id.to_le_bytes().as_ref()],
    bump,
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,
  pub token_metadata_program: Program<'info, Metadata>,
  pub associated_token_program: Program<'info, AssociatedToken>,
  pub token_program: Interface<'info, TokenInterface>,
  pub system_program: Program<'info, System>,
  pub rent: Sysvar<'info, Rent>,

}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct CommitRandomness<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  /// CHECK: This account is checked by the switchboard smart contract
  pub randomness_account: UncheckedAccount<'info>,

  pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct CommitLimitedLotteryRandomness<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = limited_lottery.bump
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  /// CHECK: This account is checked by the switchboard smart contract
  pub randomness_account: UncheckedAccount<'info>,

  pub system_program: Program<'info, System>,

}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct RevealWinner<'info> {
  #[account(mut)]
  payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = token_lottery.bump,
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,


  /// CHECK: This account is checked by the switchboard smart contract
  pub randomness_account: UncheckedAccount<'info>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct RevealLimitedLotteryWinner<'info> {
  #[account(mut)]
  payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = limited_lottery.bump
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,


  /// CHECK: This account is checked by the switchboard smart contract
  pub randomness_account: UncheckedAccount<'info>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct ClaimWinnings<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = token_lottery.bump
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  #[account(
    seeds = [lottery_id.to_le_bytes().as_ref() ,token_lottery.winner.to_le_bytes().as_ref()],
    bump,
  )]
  pub ticket_mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [b"collection_mint".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  pub ticket_metadata: Account<'info, MetadataAccount>,

  #[account(
    associated_token::mint = ticket_mint,
    associated_token::authority = payer,
    associated_token::token_program = token_program,
  )]
  pub ticket_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  pub collection_metadata: Account<'info, MetadataAccount>,

  pub token_metadata_program: Program<'info, Metadata>,
  pub token_program: Interface<'info, TokenInterface>,
  pub system_program: Program<'info, System>,

}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct ClaimLimitedLotteryWinnings<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
    mut,
    seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump = limited_lottery.bump,
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  #[account(
    seeds = [b"limited_lottery".as_ref() ,lottery_id.to_le_bytes().as_ref(), limited_lottery.winner.to_le_bytes().as_ref()],
    bump,
  )]
  pub ticket_mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [b"collection_mint".as_ref(), b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
    bump
  )]
  pub collection_mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [b"metadata", token_metadata_program.key().as_ref(), ticket_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  pub ticket_metadata: Account<'info, MetadataAccount>,

  #[account(
    associated_token::mint = ticket_mint,
    associated_token::authority = payer,
    associated_token::token_program = token_program,
  )]
  pub ticket_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    seeds = [b"metadata", token_metadata_program.key().as_ref(), collection_mint.key().as_ref()],
    bump,
    seeds::program = token_metadata_program.key(),
  )]
  pub collection_metadata: Account<'info, MetadataAccount>,

  pub token_metadata_program: Program<'info, Metadata>,
  pub token_program: Interface<'info, TokenInterface>,
  pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct TransferToAuthority<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
      mut,
      seeds = [b"token_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
      bump = token_lottery.bump
  )]
  pub token_lottery: Box<Account<'info, TokenLottery>>,

  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct LimitedLotteryTransferToAuthority<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
      mut,
      seeds = [b"limited_lottery".as_ref(), lottery_id.to_le_bytes().as_ref()],
      bump = limited_lottery.bump
  )]
  pub limited_lottery: Box<Account<'info, LimitedLottery>>,

  pub system_program: Program<'info, System>,
}

#[error_code]
pub enum ErrorCode {
  #[msg("UnAuthorized Admin")]
  UnauthorizedAdmin,
  #[msg("lottery is not open!")]
  LotteryNotOpen,
  #[msg("Not Authorized")]
  NotAuthorized,
  #[msg("Randomness already revealed")]
  RandomnessAlreadyRevealed,
  #[msg("Incorrect Randomness Account")]
  IncorrectRandomnessAccount,
  #[msg("Lottery Not Completed")]
  LotteryNotCompleted,
  #[msg("Winner Already Chosen")]
  WinnerChosen,
  #[msg("Randomness not resolved")]
  RandomnessNotResolved,
  #[msg("Winner is not chosen")]
  WinnerNotChosen,
  #[msg("Collection is not verified")]
  CollectionNotVerified,
  #[msg("Ticket is not correct")]
  IncorrectTicket,
  #[msg("No Ticket is present")]
  NoTicket,
  #[msg("Winnings already claimed")]
  WinningsAlreadyClaimed,
  #[msg("Insufficient funds to transfer")]
  InsufficientFunds,
  #[msg("Invalid Ticket Number")]
  InvalidTicketNumber,
  #[msg("Ticket Already Sold")]
  TicketAlreadySold,
  #[msg("Math Overflow")]
  MathOverflow,
}