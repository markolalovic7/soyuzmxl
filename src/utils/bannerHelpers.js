import AMFBImg from "../assets/img/sports/banners/AMFB.jpg";
import AURLImg from "../assets/img/sports/banners/AURL.jpg";
import BADMImg from "../assets/img/sports/banners/BADM.jpg";
import BASEImg from "../assets/img/sports/banners/BASE.jpg";
import BASKImg from "../assets/img/sports/banners/BASK.jpg";
import BEVOImg from "../assets/img/sports/banners/BEVO.jpg";
import BOXIImg from "../assets/img/sports/banners/BOXI.jpg";
import COUNImg from "../assets/img/sports/banners/COUN.jpg";
import CRICImg from "../assets/img/sports/banners/CRIC.jpg";
import CYCLImg from "../assets/img/sports/banners/CYCL.jpg";
import DARTImg from "../assets/img/sports/banners/DART.jpg";
import DefaultImg from "../assets/img/sports/banners/default.jpg";
import DOTAImg from "../assets/img/sports/banners/DOTA.jpg";
import FOOTImg from "../assets/img/sports/banners/FOOT.jpg";
import FUTSImg from "../assets/img/sports/banners/FUTS.jpg";
import GOLFImg from "../assets/img/sports/banners/GOLF.jpg";
import HANDImg from "../assets/img/sports/banners/HAND.jpg";
import ICEHImg from "../assets/img/sports/banners/ICEH.jpg";
import LEAGImg from "../assets/img/sports/banners/LEAG.jpg";
import MOSPImg from "../assets/img/sports/banners/MOSP.jpg";
import OVERImg from "../assets/img/sports/banners/OVER.jpg";
import RUGUImg from "../assets/img/sports/banners/RUGU.jpg";
import SKIIImg from "../assets/img/sports/banners/SKII.jpg";
import SNOOImg from "../assets/img/sports/banners/SNOO.jpg";
import STARImg from "../assets/img/sports/banners/STAR.jpg";
import TABLImg from "../assets/img/sports/banners/TABL.jpg";
import TENNImg from "../assets/img/sports/banners/TENN.jpg";
import VOLLImg from "../assets/img/sports/banners/VOLL.jpg";
import WATEImg from "../assets/img/sports/banners/WATE.jpg";

export const getImg = (sportCode) => {
  switch (sportCode) {
    case "AMFB":
      return AMFBImg;
    case "BEVO":
      return BEVOImg;
    case "DART":
      return DARTImg;
    case "HAND":
      return HANDImg;
    case "RUGU":
      return RUGUImg;
    case "TENN":
      return TENNImg;
    case "AURL":
      return AURLImg;
    case "BOXI":
      return BOXIImg;
    case "DOTA":
      return DOTAImg;
    case "ICEH":
      return ICEHImg;
    case "SKII":
      return SKIIImg;
    case "VOLL":
      return VOLLImg;
    case "BADM":
      return BADMImg;
    case "COUN":
      return COUNImg;
    case "FOOT":
      return FOOTImg;
    case "LEAG":
      return LEAGImg;
    case "SNOO":
      return SNOOImg;
    case "WATE":
      return WATEImg;
    case "BASE":
      return BASEImg;
    case "CRIC":
      return CRICImg;
    case "FUTS":
      return FUTSImg;
    case "MOSP":
      return MOSPImg;
    case "STAR":
      return STARImg;
    case "BASK":
      return BASKImg;
    case "CYCL":
      return CYCLImg;
    case "GOLF":
      return GOLFImg;
    case "OVER":
      return OVERImg;
    case "TABL":
      return TABLImg;
    default:
      return DefaultImg;
  }
};
