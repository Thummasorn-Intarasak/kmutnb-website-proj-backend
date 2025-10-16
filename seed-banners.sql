-- สคริปต์สำหรับเพิ่มข้อมูล banner ทดสอบ
-- รันคำสั่งนี้ใน PostgreSQL เพื่อเพิ่มข้อมูล
-- ลบข้อมูลเดิม (ถ้ามี)
TRUNCATE TABLE banner RESTART IDENTITY CASCADE;
-- เพิ่มข้อมูล banner (ต้องมี item/game อยู่ก่อนจึงจะเพิ่ม banner ได้)
-- สมมติว่ามี game_id 1, 2, 3 ในตาราง item แล้ว
INSERT INTO banner (banner_name, banner_image, game_id)
VALUES (
        'Summer Sale - Cyberpunk 2077',
        'uploads/images/banner-cyberpunk.jpg',
        1
    ),
    (
        'Hot Deal - The Witcher 3',
        'uploads/images/banner-witcher.jpg',
        2
    ),
    (
        'New Release - Red Dead Redemption 2',
        'uploads/images/banner-rdr2.jpg',
        3
    );
-- ตรวจสอบข้อมูลที่เพิ่ม
SELECT b.banner_id,
    b.banner_name,
    b.banner_image,
    b.game_id,
    i.game_name as game_name,
    i.game_price as game_price
FROM banner b
    LEFT JOIN item i ON b.game_id = i.game_id
ORDER BY b.banner_id;