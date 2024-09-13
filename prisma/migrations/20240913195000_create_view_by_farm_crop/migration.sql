-- DropView
DROP VIEW IF EXISTS "ProductorsByFarmCrop";

-- CreateView
CREATE VIEW "ProductorsByFarmCrop" AS
SELECT
  DISTINCT UNNEST("farmCrops") AS "farmCrop",
  COUNT(*) AS "totalProductors"
FROM
  "AgriculturalProductor"
GROUP BY
	DISTINCT UNNEST("farmCrops");
