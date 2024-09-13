SELECT
  DISTINCT unnest("AgriculturalProductor"."farmCrops") AS "farmCrop",
  count(*) AS "totalProductors"
FROM
  "AgriculturalProductor"
GROUP BY
  DISTINCT (unnest("AgriculturalProductor"."farmCrops"));