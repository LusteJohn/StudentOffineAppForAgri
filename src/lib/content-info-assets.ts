import { Image } from 'react-native';

const ASSET_MAP: Record<string, number> = {
  'module_images/M1/L1/Ancona.jpg': require('../../assets/module_images/M1/L1/Ancona.jpg'),
  'module_images/M1/L1/Andalusian.jpg': require('../../assets/module_images/M1/L1/Andalusian.jpg'),
  'module_images/M1/L1/Australorp.png': require('../../assets/module_images/M1/L1/Australorp.png'),
  'module_images/M1/L1/Barbezieux.jpg': require('../../assets/module_images/M1/L1/Barbezieux.jpg'),
  'module_images/M1/L1/Basque_Chicken.jpg': require('../../assets/module_images/M1/L1/Basque_Chicken.jpg'),
  'module_images/M1/L1/Bielefelder.png': require('../../assets/module_images/M1/L1/Bielefelder.png'),
  'module_images/M1/L1/Black_Star_Red_Star.png': require('../../assets/module_images/M1/L1/Black_Star_Red_Star.png'),
  'module_images/M1/L1/Bresse.jpg': require('../../assets/module_images/M1/L1/Bresse.jpg'),
  'module_images/M1/L1/Brussbar.jpg': require('../../assets/module_images/M1/L1/Brussbar.jpg'),
  'module_images/M1/L1/California_Grey.jpg': require('../../assets/module_images/M1/L1/California_Grey.jpg'),
  'module_images/M1/L1/Catalana.jpg': require('../../assets/module_images/M1/L1/Catalana.jpg'),
  'module_images/M1/L1/Cinnamon_Queen.jpg': require('../../assets/module_images/M1/L1/Cinnamon_Queen.jpg'),
  'module_images/M1/L1/Cornish.jpg': require('../../assets/module_images/M1/L1/Cornish.jpg'),
  'module_images/M1/L1/Cubalaya.jpg': require('../../assets/module_images/M1/L1/Cubalaya.jpg'),
  'module_images/M1/L1/Dorking.jpg': require('../../assets/module_images/M1/L1/Dorking.jpg'),
  'module_images/M1/L1/Dutch_Bantam.jpg': require('../../assets/module_images/M1/L1/Dutch_Bantam.jpg'),
  'module_images/M1/L1/Gallina_di_Saluzzo.jpg': require('../../assets/module_images/M1/L1/Gallina_di_Saluzzo.jpg'),
  'module_images/M1/L1/Gournay.jpg': require('../../assets/module_images/M1/L1/Gournay.jpg'),
  'module_images/M1/L1/Holland.jpg': require('../../assets/module_images/M1/L1/Holland.jpg'),
  'module_images/M1/L1/Ixworth.jpg': require('../../assets/module_images/M1/L1/Ixworth.jpg'),
  'module_images/M1/L1/Java.jpg': require('../../assets/module_images/M1/L1/Java.jpg'),
  'module_images/M1/L1/Jersey_Giant.jpg': require('../../assets/module_images/M1/L1/Jersey_Giant.jpg'),
  'module_images/M1/L1/Langshan.jpg': require('../../assets/module_images/M1/L1/Langshan.jpg'),
  'module_images/M1/L1/Leghorn.jpg': require('../../assets/module_images/M1/L1/Leghorn.jpg'),
  'module_images/M1/L1/Maran.jpg': require('../../assets/module_images/M1/L1/Maran.jpg'),
  'module_images/M1/L1/Marsh_Daisy.jpg': require('../../assets/module_images/M1/L1/Marsh_Daisy.jpg'),
  'module_images/M1/L1/Minorca.jpg': require('../../assets/module_images/M1/L1/Minorca.jpg'),
  'module_images/M1/L1/Naked_Neck.jpg': require('../../assets/module_images/M1/L1/Naked_Neck.jpg'),
  'module_images/M1/L1/New_Hampshire.jpg': require('../../assets/module_images/M1/L1/New_Hampshire.jpg'),
  'module_images/M1/L1/Norfolk_Grey.jpg': require('../../assets/module_images/M1/L1/Norfolk_Grey.jpg'),
  'module_images/M1/L1/Norwegian_Jaehorn.jpg': require('../../assets/module_images/M1/L1/Norwegian_Jaehorn.jpg'),
  'module_images/M1/L1/Old_English_Game.jpg': require('../../assets/module_images/M1/L1/Old_English_Game.jpg'),
  'module_images/M1/L1/Orpington.jpg': require('../../assets/module_images/M1/L1/Orpington.jpg'),
  'module_images/M1/L1/Pekin_Bantam.jpg': require('../../assets/module_images/M1/L1/Pekin_Bantam.jpg'),
  'module_images/M1/L1/Penedesenca.jpg': require('../../assets/module_images/M1/L1/Penedesenca.jpg'),
  'module_images/M1/L1/Plymouth_Rock.jpg': require('../../assets/module_images/M1/L1/Plymouth_Rock.jpg'),
  'module_images/M1/L1/Red_Cap.jpg': require('../../assets/module_images/M1/L1/Red_Cap.jpg'),
  'module_images/M1/L1/Red_Shaver.jpg': require('../../assets/module_images/M1/L1/Red_Shaver.jpg'),
  'module_images/M1/L1/Rhode_Island_Red.jpg': require('../../assets/module_images/M1/L1/Rhode_Island_Red.jpg'),
  'module_images/M1/L1/Rhodebar.jpg': require('../../assets/module_images/M1/L1/Rhodebar.jpg'),
  'module_images/M1/L1/Rosecomb_Bantam.jpg': require('../../assets/module_images/M1/L1/Rosecomb_Bantam.jpg'),
  'module_images/M1/L1/Scots_Dumpy.jpg': require('../../assets/module_images/M1/L1/Scots_Dumpy.jpg'),
  'module_images/M1/L1/Speckledy.jpg': require('../../assets/module_images/M1/L1/Speckledy.jpg'),
  'module_images/M1/L1/Sussex.jpg': require('../../assets/module_images/M1/L1/Sussex.jpg'),
  'module_images/M1/L1/Twentse.jpg': require('../../assets/module_images/M1/L1/Twentse.jpg'),
  'module_images/M1/L1/Vorwerk.jpg': require('../../assets/module_images/M1/L1/Vorwerk.jpg'),
  'module_images/M1/L1/Welsummer.jpg': require('../../assets/module_images/M1/L1/Welsummer.jpg'),
  'module_images/M1/L1/Wyandotte.jpg': require('../../assets/module_images/M1/L1/Wyandotte.jpg'),
  'module_images/M1/L1/chick.jpg': require('../../assets/module_images/M1/L1/chick.jpg'),
  'module_images/M1/L1/chicken_house.png': require('../../assets/module_images/M1/L1/chicken_house.png'),
  'module_images/M1/L1/rat.png': require('../../assets/module_images/M1/L1/rat.png'),
  'module_images/M1/L1/unit.png': require('../../assets/module_images/M1/L1/unit.png'),
  'module_images/M1/L2/baby_chick.jpg': require('../../assets/module_images/M1/L2/baby_chick.jpg'),
  'module_images/M1/L2/chickens.jpg': require('../../assets/module_images/M1/L2/chickens.jpg'),
  'module_images/M1/L2/chicks.jpg': require('../../assets/module_images/M1/L2/chicks.jpg'),
  'module_images/M1/L2/list_chicken.jpg': require('../../assets/module_images/M1/L2/list_chicken.jpg'),
  'module_images/M1/L2/sprout.jpg': require('../../assets/module_images/M1/L2/sprout.jpg'),
  'module_images/M1/L2/table1.png': require('../../assets/module_images/M1/L2/table1.png'),
  'module_images/M1/L3/house_chick.jpg': require('../../assets/module_images/M1/L3/house_chick.jpg'),
  'module_images/M1/L3/table.png': require('../../assets/module_images/M1/L3/table.png'),
  'module_images/M1/L4/chicken_disease.jpg': require('../../assets/module_images/M1/L4/chicken_disease.jpg'),
  'module_images/M1/L4/table_content.png': require('../../assets/module_images/M1/L4/table_content.png'),
  'module_images/placeholder.png': require('../../assets/module_images/placeholder.png'),
  'module_images/M1/L1/Ancona.png': require('../../assets/module_images/M1/L1/Ancona.jpg'),
  'module_images/M1/L1/Andalusian.png': require('../../assets/module_images/M1/L1/Andalusian.jpg'),
  'module_images/M1/L1/Australorp.jpg': require('../../assets/module_images/M1/L1/Australorp.png'),
  'module_images/M1/L1/Barbezieux.png': require('../../assets/module_images/M1/L1/Barbezieux.jpg'),
  'module_images/M1/L1/Basque_Chicken.png': require('../../assets/module_images/M1/L1/Basque_Chicken.jpg'),
  'module_images/M1/L1/Bielefelder.jpg': require('../../assets/module_images/M1/L1/Bielefelder.png'),
  'module_images/M1/L1/Black_Star_Red_Star.jpg': require('../../assets/module_images/M1/L1/Black_Star_Red_Star.png'),
  'module_images/M1/L1/Bresse.png': require('../../assets/module_images/M1/L1/Bresse.jpg'),
  'module_images/M1/L1/Brussbar.png': require('../../assets/module_images/M1/L1/Brussbar.jpg'),
  'module_images/M1/L1/California_Grey.png': require('../../assets/module_images/M1/L1/California_Grey.jpg'),
  'module_images/M1/L1/Catalana.png': require('../../assets/module_images/M1/L1/Catalana.jpg'),
  'module_images/M1/L1/Cinnamon_Queen.png': require('../../assets/module_images/M1/L1/Cinnamon_Queen.jpg'),
  'module_images/M1/L1/Cornish.png': require('../../assets/module_images/M1/L1/Cornish.jpg'),
  'module_images/M1/L1/Cubalaya.png': require('../../assets/module_images/M1/L1/Cubalaya.jpg'),
  'module_images/M1/L1/Dorking.png': require('../../assets/module_images/M1/L1/Dorking.jpg'),
  'module_images/M1/L1/Dutch_Bantam.png': require('../../assets/module_images/M1/L1/Dutch_Bantam.jpg'),
  'module_images/M1/L1/Gallina_di_Saluzzo.png': require('../../assets/module_images/M1/L1/Gallina_di_Saluzzo.jpg'),
  'module_images/M1/L1/Gournay.png': require('../../assets/module_images/M1/L1/Gournay.jpg'),
  'module_images/M1/L1/Holland.png': require('../../assets/module_images/M1/L1/Holland.jpg'),
  'module_images/M1/L1/Ixworth.png': require('../../assets/module_images/M1/L1/Ixworth.jpg'),
  'module_images/M1/L1/Java.png': require('../../assets/module_images/M1/L1/Java.jpg'),
  'module_images/M1/L1/Jersey_Giant.png': require('../../assets/module_images/M1/L1/Jersey_Giant.jpg'),
  'module_images/M1/L1/Langshan.png': require('../../assets/module_images/M1/L1/Langshan.jpg'),
  'module_images/M1/L1/Leghorn.png': require('../../assets/module_images/M1/L1/Leghorn.jpg'),
  'module_images/M1/L1/Maran.png': require('../../assets/module_images/M1/L1/Maran.jpg'),
  'module_images/M1/L1/Marsh_Daisy.png': require('../../assets/module_images/M1/L1/Marsh_Daisy.jpg'),
  'module_images/M1/L1/Minorca.png': require('../../assets/module_images/M1/L1/Minorca.jpg'),
  'module_images/M1/L1/Naked_Neck.png': require('../../assets/module_images/M1/L1/Naked_Neck.jpg'),
  'module_images/M1/L1/New_Hampshire.png': require('../../assets/module_images/M1/L1/New_Hampshire.jpg'),
  'module_images/M1/L1/Norfolk_Grey.png': require('../../assets/module_images/M1/L1/Norfolk_Grey.jpg'),
  'module_images/M1/L1/Norwegian_Jaehorn.png': require('../../assets/module_images/M1/L1/Norwegian_Jaehorn.jpg'),
  'module_images/M1/L1/Old_English_Game.png': require('../../assets/module_images/M1/L1/Old_English_Game.jpg'),
  'module_images/M1/L1/Orpington.png': require('../../assets/module_images/M1/L1/Orpington.jpg'),
  'module_images/M1/L1/Pekin_Bantam.png': require('../../assets/module_images/M1/L1/Pekin_Bantam.jpg'),
  'module_images/M1/L1/Penedesenca.png': require('../../assets/module_images/M1/L1/Penedesenca.jpg'),
  'module_images/M1/L1/Plymouth_Rock.png': require('../../assets/module_images/M1/L1/Plymouth_Rock.jpg'),
  'module_images/M1/L1/Red_Cap.png': require('../../assets/module_images/M1/L1/Red_Cap.jpg'),
  'module_images/M1/L1/Red_Shaver.png': require('../../assets/module_images/M1/L1/Red_Shaver.jpg'),
  'module_images/M1/L1/Rhode_Island_Red.png': require('../../assets/module_images/M1/L1/Rhode_Island_Red.jpg'),
  'module_images/M1/L1/Rhodebar.png': require('../../assets/module_images/M1/L1/Rhodebar.jpg'),
  'module_images/M1/L1/Rosecomb_Bantam.png': require('../../assets/module_images/M1/L1/Rosecomb_Bantam.jpg'),
  'module_images/M1/L1/Scots_Dumpy.png': require('../../assets/module_images/M1/L1/Scots_Dumpy.jpg'),
  'module_images/M1/L1/Speckledy.png': require('../../assets/module_images/M1/L1/Speckledy.jpg'),
  'module_images/M1/L1/Sussex.png': require('../../assets/module_images/M1/L1/Sussex.jpg'),
  'module_images/M1/L1/Twentse.png': require('../../assets/module_images/M1/L1/Twentse.jpg'),
  'module_images/M1/L1/Vorwerk.png': require('../../assets/module_images/M1/L1/Vorwerk.jpg'),
  'module_images/M1/L1/Welsummer.png': require('../../assets/module_images/M1/L1/Welsummer.jpg'),
  'module_images/M1/L1/Wyandotte.png': require('../../assets/module_images/M1/L1/Wyandotte.jpg'),
  'module_images/M1/L1/chick.png': require('../../assets/module_images/M1/L1/chick.jpg'),
  'module_images/M1/L1/chicken_house.jpg': require('../../assets/module_images/M1/L1/chicken_house.png'),
  'module_images/M1/L1/rat.jpg': require('../../assets/module_images/M1/L1/rat.png'),
  'module_images/M1/L1/unit.jpg': require('../../assets/module_images/M1/L1/unit.png'),
  'module_images/M1/L2/baby_chick.png': require('../../assets/module_images/M1/L2/baby_chick.jpg'),
  'module_images/M1/L2/chickens.png': require('../../assets/module_images/M1/L2/chickens.jpg'),
  'module_images/M1/L2/chicks.png': require('../../assets/module_images/M1/L2/chicks.jpg'),
  'module_images/M1/L2/list_chicken.png': require('../../assets/module_images/M1/L2/list_chicken.jpg'),
  'module_images/M1/L2/sprout.png': require('../../assets/module_images/M1/L2/sprout.jpg'),
  'module_images/M1/L2/table1.jpg': require('../../assets/module_images/M1/L2/table1.png'),
  'module_images/M1/L3/house_chick.png': require('../../assets/module_images/M1/L3/house_chick.jpg'),
  'module_images/M1/L3/table.jpg': require('../../assets/module_images/M1/L3/table.png'),
  'module_images/M1/L4/chicken_disease.png': require('../../assets/module_images/M1/L4/chicken_disease.jpg'),
  'module_images/M1/L4/table_content.jpg': require('../../assets/module_images/M1/L4/table_content.png'),
  'module_images/placeholder.jpg': require('../../assets/module_images/placeholder.png'),
};

export function resolveContentInfoAsset(assetPath: string): string | null {
  if (!assetPath) return null;
  if (assetPath.startsWith('file://') || assetPath.startsWith('http')) {
    return assetPath;
  }

  const lookup = assetPath.replace(/^assets\//, '');
  const direct = ASSET_MAP[lookup];
  if (direct != null) {
    try {
      const resolved = Image.resolveAssetSource(direct);
      const uri = resolved?.uri ?? null;
      console.log('[asset] direct match', assetPath, '->', lookup, 'uri=', uri);
      return uri;
    } catch (e) {
      console.log('[asset] Image.resolveAssetSource failed for', lookup, e);
    }
  }

  const withoutExt = lookup.replace(/\.[^.]+$/, '');
  const altPath =
    lookup.endsWith('.jpg') ? `${withoutExt}.png` :
    lookup.endsWith('.png') ? `${withoutExt}.jpg` :
    null;

  if (altPath) {
    const altModule = ASSET_MAP[altPath];
    if (altModule != null) {
      try {
        const resolved = Image.resolveAssetSource(altModule);
        const uri = resolved?.uri ?? null;
        console.log('[asset] alt match', assetPath, '->', altPath, 'uri=', uri);
        return uri;
      } catch (e) {
        console.log('[asset] Image.resolveAssetSource failed for', altPath, e);
      }
    }
    console.log('[asset] alt miss', assetPath, '->', altPath);
  }

  console.warn('Content info asset not mapped:', assetPath);
  return null;
}
