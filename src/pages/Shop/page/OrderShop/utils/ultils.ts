export const calculateMaxheightForSpoiler = (totalHeight: number, heightEachItem: number, qtyToDisplay: number) => {
  if (heightEachItem <= 0) return 0
  const itemsToDisplayHeight = heightEachItem * qtyToDisplay
  return Math.min(itemsToDisplayHeight, totalHeight)
}
