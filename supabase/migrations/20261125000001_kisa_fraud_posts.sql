-- Verified KISA B0000133 RSS title searches on 2026-11-25.
-- Search terms: 피싱, 스미싱, 사칭, 탈취, 큐싱, 사기.
-- 48 RSS entries yield 28 unique fraud-related notices after filtering.
-- Only official title/link/date metadata is retained; no article body or generated summary.
begin;
insert into public.security_posts (title, summary, category, source, source_url, published_at)
values
  ('코인 탈취를 위한 악성URL 유포에 따른 스미싱 주의', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72219&menuNo=205020', '2026-10-16'),
  ('금융권 등 개인정보 유출 사고 피해보상금 지급 등 사칭 피싱 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72211&menuNo=205020', '2026-10-06'),
  ('공공기관 사칭 해킹메일을 통한 사기 시도 사례 보고', NULL, '기관 사칭', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72202&menuNo=205020', '2026-09-29'),
  ('추석 명절 연휴기간 스미싱, 피싱 등 사이버사기 주의', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72191&menuNo=205020', '2026-09-17'),
  ('주민센터 전화번호를 사칭한 회신유도 보이스피싱 주의', NULL, '보이스피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72158&menuNo=205020', '2026-08-11'),
  ('계정 탈취 유형 스미싱·피싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72139&menuNo=205020', '2026-07-21'),
  ('카드사 사칭 스미싱·피싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72131&menuNo=205020', '2026-07-16'),
  ('“OTT 플랫폼” 개인정보 유출 사고 악용 스미싱·피싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72078&menuNo=205020', '2026-06-03'),
  ('(사례)"고유가 지원금" 사칭 스미싱·피싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72060&menuNo=205020', '2026-05-21'),
  ('“여행 예약 플랫폼”해킹으로 인한 스미싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72049&menuNo=205020', '2026-05-12'),
  ('주민센터를 사칭한 대표번호 회신유도 보이스피싱 주의', NULL, '보이스피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72036&menuNo=205020', '2026-04-28'),
  ('고유가 피해 지원금 사칭 피싱 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72029&menuNo=205020', '2026-04-16'),
  ('카카오톡 사칭 악성코드 유포 주의권고', NULL, '사기 예방', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72027&menuNo=205020', '2026-04-15'),
  ('유류비, 주유 지원금 등 중동 사태를 악용한 스미싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=72001&menuNo=205020', '2026-03-16'),
  ('설 명절 연휴기간 스미싱, 피싱 등 사이버 사기 주의', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71966&menuNo=205020', '2026-02-12'),
  ('정부기관, 싱크탱크 사칭 큐싱(Quishing) 유포 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71936&menuNo=205020', '2026-01-10'),
  ('(사례) 이커머스 해킹 피해 악용 스미싱·피싱 주의권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71925&menuNo=205020', '2025-12-19'),
  ('공공기관 대표번호를 악용한 카드 배송 사칭 보이스피싱 주의', NULL, '보이스피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71904&menuNo=205020', '2025-11-26'),
  ('정부기관 사칭, 사기 피해자 구제를  유도하는 피싱사이트 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71791&menuNo=205020', '2025-07-02'),
  ('설 명절  연휴기간 스미싱 등 사이버 사기 주의', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71643&menuNo=205020', '2025-01-24'),
  ('가상자산 탈취를 위한 피싱 공격 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71638&menuNo=205020', '2025-01-17'),
  ('무료 쿠폰앱·사은행사 등 사칭 큐싱 주의 권고', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71612&menuNo=205020', '2024-12-19'),
  ('SNS 소셜커머스 등 계정 탈취를 노리는 스미싱 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=71555&menuNo=205020', '2024-09-19'),
  ('아이폰 대상 네이버 계정탈취 스미싱 문자 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=35786&menuNo=205020', '2020-11-10'),
  ('아이폰 계정 탈취 스미싱 문자 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=35143&menuNo=205020', '2019-09-19'),
  ('아이폰 계정 탈취 스미싱 문자 주의 권고', NULL, '스미싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=35144&menuNo=205020', '2019-09-19'),
  ('최근 피싱, 파밍 기법을 이용한 금융정보탈취 동향', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=21863&menuNo=205020', '2014-09-05'),
  ('피싱과 큐싱의 결합 공격', NULL, '피싱', 'KISA', 'https://www.boho.or.kr/kr/bbs/view.do?bbsId=B0000133&nttId=21619&menuNo=205020', '2014-04-07')
on conflict (source_url) do nothing;
commit;
