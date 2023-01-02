import AMFBBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-amfb.png";
import AURLBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-aurl.png";
import BADMBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-badm.png";
import BASEBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-base.png";
import BASKBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-bask.png";
import BEVOBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-bevo.png";
import BOXIBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-boxi.png";
import COUNBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-coun.png";
import CRICBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-cric.png";
import CYCLBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-cycl.png";
import DARTBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-dart.png";
import DOTABgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-dota.png";
import FOOTBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-foot.png";
import FUTSBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-futs.png";
import GOLFBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-golf.png";
import HANDBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-hand.png";
import IHUSBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-ihus.png";
import LEAGBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-leag.png";
import MOSPBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-mosp.png";
import OVERBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-over.png";
import RUGBBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-rugb.png";
import SKIIBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-skii.png";
import SNOOBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-snoo.png";
import STARBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-star.png";
import TABLBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-tabl.png";
import TENNBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-tenn.png";
import VOLLBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-voll.png";
import WATEBgImgUrl from "../../../../../assets/img/backgrounds/jackpots/jackpot-bg-wate.png";

export function getJackpotImgBgUrl(sportCode) {
  switch (sportCode) {
    case "AMFB":
      return AMFBBgImgUrl;
    case "AURL":
      return AURLBgImgUrl;
    case "BADM":
      return BADMBgImgUrl;
    case "BASE":
      return BASEBgImgUrl;
    case "BASK":
      return BASKBgImgUrl;
    case "BOVE":
      return BEVOBgImgUrl;
    case "BOXI":
      return BOXIBgImgUrl;
    case "COUN":
      return COUNBgImgUrl;
    case "CRIC":
      return CRICBgImgUrl;
    case "CYCL":
      return CYCLBgImgUrl;
    case "DART":
      return DARTBgImgUrl;
    case "DOTA":
      return DOTABgImgUrl;
    case "FOOT":
      return FOOTBgImgUrl;
    case "FUTS":
      return FUTSBgImgUrl;
    case "GODF":
      return GOLFBgImgUrl;
    case "HAND":
      return HANDBgImgUrl;
    case "IHUS":
      return IHUSBgImgUrl;
    case "LEAG":
      return LEAGBgImgUrl;
    case "MOSP":
      return MOSPBgImgUrl;
    case "OVER":
      return OVERBgImgUrl;
    case "RUGB":
      return RUGBBgImgUrl;
    case "SKII":
      return SKIIBgImgUrl;
    case "SNOO":
      return SNOOBgImgUrl;
    case "STAR":
      return STARBgImgUrl;
    case "TABL":
      return TABLBgImgUrl;
    case "TENN":
      return TENNBgImgUrl;
    case "VOLL":
      return VOLLBgImgUrl;
    case "WATE":
      return WATEBgImgUrl;
    default:
      return FOOTBgImgUrl;
  }
}
