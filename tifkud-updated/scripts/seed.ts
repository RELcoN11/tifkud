import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const dilemmasData = [
  { id: 1, title: "משפחה באזור מאוים", situation: "חייל מודיע כי משפחתו נמצאת באזור מאוים. האם לשחרר אותו לטפל במשפחתו או להשאירו בתפקיד קריטי.", affectedSequences: "שליטה, שייכות", recommendedActions: [] },
  { id: 2, title: "צוות שחוק", situation: "צוות אחד נשחק לאחר ימים של כוננות. האם להחליפו בצוות פחות מנוסה.", affectedSequences: "מסוגלות, שליטה", recommendedActions: ["חלוקת משימות והפעלה של דרגי משנה", "עבודה על-פי שעון פעילות המאפשר החלפת משמרות והפוגות קצרות"] },
  { id: 3, title: "ירידה בריכוז", situation: "הצוות מראה ירידה בריכוז לאחר ימים של דריכות.", affectedSequences: "מסוגלות, משמעות", recommendedActions: ["לקיים עצירות למידה מבצעיות תכופות קצרות", "עבודה על-פי שעון פעילות המאפשר התאוששות"] },
  { id: 4, title: "עומס על מפקד זוטר", situation: "מפקד זוטר מתקשה לתפקד תחת עומס.", affectedSequences: "מסוגלות, שליטה", recommendedActions: ["ניהול עומסים מודע למניעת שחיקת מפקדים מרכזיים", "הפחתה או דחייה של פעילויות שאינן קריטיות"] },
  { id: 5, title: "צוות מצטיין בעומס יתר", situation: "צוות מסוים מתפקד היטב אך תחת עומס יתר.", affectedSequences: "מסוגלות", recommendedActions: ["להכיר בהצלחות אך להדגיש כי המערכה עדיין מתפתחת", "תעדוף משימות והפחתת פעילויות לא קריטיות"] },
  { id: 6, title: "אובדן פוקוס בלילות", situation: "חיילים מתקשים לשמור על ריכוז בלילות ארוכים של כוננות.", affectedSequences: "מסוגלות, שליטה", recommendedActions: ["שמירה על רציפות תפקודית תוך הקפדה על מקצועיות ויציבות", "יצירת הפוגות קצרות"] },
  { id: 7, title: "עייפות מצטברת", situation: "הכוח מגלה סימני עייפות מצטברת.", affectedSequences: "מסוגלות", recommendedActions: ["הכרה בכך שהיחידה פועלת על גבי עומס מצטבר", "לאפשר החלפת משמרות והפעלה מדורגת"] },
  { id: 8, title: "תלות במפקד", situation: "החיילים תלויים מאוד בהחלטות המפקד.", affectedSequences: "מסוגלות, שליטה", recommendedActions: ["חלוקת משימות והפעלה של דרגי משנה", "מסרים עקביים ושגרות עבודה ברורות גם במצבי שינוי"] },
  { id: 9, title: "ירידת דריכות ללא אירועים", situation: "לאחר מספר ימים ללא אירועים מתחילה ירידה בדריכות.", affectedSequences: "משמעות, מסוגלות", recommendedActions: ["שימור מוכנות לשינוי מהיר במציאות המבצעית", "לקיים עצירות למידה למניעת נקודות עיוורון"] },
  { id: 10, title: "כוח חלקי בבית", situation: "חלק מהכוח עדיין בבית כשמתקבלת התרעה לכוננות.", affectedSequences: "שליטה, שייכות", recommendedActions: ["להיעזר באמצעים דיגיטליים לניהול העבודה והקשר", "לקיים תקשורת שוטפת ולעדכן באופן קבוע במצב ובמשימות"] },
  { id: 11, title: "כוננות ללא פעילות", situation: "היחידה בכוננות ממושכת ללא פעילות מבצעית.", affectedSequences: "משמעות, ודאות", recommendedActions: ["להמשיך בביצוע המשימות המבצעיות כבשגרה", "לעדכן את הכוחות במתרחש ברמה המערכתית"] },
  { id: 12, title: "משימה מחוץ למומחיות", situation: "מתקבלת משימה שאינה בליבת המומחיות.", affectedSequences: "מסוגלות, ודאות", recommendedActions: ["קידום תהליכים המחזקים את היכולות המקצועיות של היחידה", "לנצל את התקופה להעמקת למידה מקצועית"] },
  { id: 13, title: "חוסר משמעות", situation: "חיילים חווים חוסר משמעות בהיעדר פעילות מבצעית.", affectedSequences: "משמעות, שייכות", recommendedActions: ["לחבר מערכים שאינם בליבה למשימות תומכות בעלות ערך ברור", "לקבוע משימות ברורות ולייצר תוצרים מוגדרים"] },
  { id: 14, title: "אדישות בהמתנה", situation: "חיילים מגלים אדישות לאחר ימים ארוכים של המתנה.", affectedSequences: "שייכות, משמעות", recommendedActions: ["לקיים מפגשים קבועים (פיזיים או מקוונים) לשימור תחושת היחידה", "להמשיך לקיים סממנים ופעילויות המחזקות את זהות היחידה"] },
  { id: 15, title: "בקשת הכרה במאמץ", situation: "הכוח מבקש הכרה במאמץ המתמשך למרות היעדר אירועים.", affectedSequences: "משמעות, שייכות", recommendedActions: ["לתווך כי המשך השגרה מאפשר למאמץ המרכזי להתמקד ומהווה תרומה חשובה", "להדגיש הצלחות ותרומות גם של המערכים המשלימים"] },
  { id: 16, title: "קליטת חייל חדש", situation: "חייל חדש מצטרף ליחידה בתקופה מתוחה.", affectedSequences: "שייכות, ודאות", recommendedActions: ["לקיים שיח פיקודי המחזק את תחושת השייכות והשותפות", "להגדיר מסגרת פעילות סדורה"] },
  { id: 17, title: "תקלה מקצועית בכוננות", situation: "מתרחשת תקלה מקצועית במהלך כוננות.", affectedSequences: "מסוגלות, שליטה", recommendedActions: ["לנצל את התקופה להעמקת למידה מקצועית והפקת לקחים", "לקיים עצירות למידה מבצעיות קצרות"] },
  { id: 18, title: "מידע חלקי על איום", situation: "מתקבל מידע חלקי על איום לבסיס.", affectedSequences: "ודאות, שליטה", recommendedActions: ["לומר במפורש כאשר אין ודאות לגבי המשך האירוע", "היערכות במקביל לתרחיש קצר ולמערכה מתמשכת"] },
  { id: 19, title: "עומסים דיפרנציאליים", situation: "חלק מהיחידה במתח מבצעי וחלק בשגרה.", affectedSequences: "שייכות", recommendedActions: ["להכיר בקיום הדיפרנציאליות ולא להתעלם ממנה (שיח פתוח)", "לחבר את כלל הכוחות שאינם בליבת הפעולה לתמונה הרחבה"] },
  { id: 20, title: "התמודדות עם שמועה", situation: "מופצת שמועה על התפתחות מבצעית חמורה.", affectedSequences: "ודאות, שליטה", recommendedActions: ["תקשורת כנה ושקופה", "תיווך המציאות - להסביר לכוחות מה השתנה ולמה"] },
  { id: 21, title: "הנחיה כללית ללא פירוט", situation: "מתקבלת הנחיה כללית ללא פירוט רב.", affectedSequences: "ודאות, מסוגלות", recommendedActions: ["להסביר לאנשי היחידה את ההיגיון המבצעי והארגוני של המצב", "להכין את היחידה לאפשרות של שינוי מהיר במצב"] },
  { id: 22, title: "תסכול אנשי מילואים", situation: "מילואימניקים מתוסכלים כי אחרים מתחלפים.", affectedSequences: "שייכות, משמעות", recommendedActions: ["שיח פתוח על הפערים והכרה בדיפרנציאליות", "להדגיש תרומות גם של המערכים המשלימים"] },
  { id: 23, title: "ספק בהחלטת מפקד", situation: "מפקד משנה מביע ספק בהחלטה שלך.", affectedSequences: "שליטה, ודאות", recommendedActions: ["לעודד העלאת ספקות מקצועיים כדי למנוע \"קונספציית הצלחה\""] },
  { id: 24, title: "התרעות שווא", situation: "מתקבלות התרעות שאינן מתממשות שוב ושוב.", affectedSequences: "ודאות, משמעות", recommendedActions: ["להדגיש כי שינויים תכופים הם חלק טבעי מהמערכה", "לאפשר לכוחות לעבד את המעבר בין מצבים"] },
  { id: 25, title: "כוח מפוצל משימתית", situation: "כוח קטן במשימה קריטית בזמן אירועים נוספים ביחידה.", affectedSequences: "שייכות, משמעות", recommendedActions: ["לחבר את כלל הכוחות לתמונה הרחבה", "לחבר מערכים למשימות תומכות בעלות ערך"] },
  { id: 26, title: "צורך בתמונה רחבה", situation: "חיילים מבקשים להבין את המצב הרחב של הלחימה.", affectedSequences: "ודאות, משמעות", recommendedActions: ["תיווך מתמיד של התמונה המערכתית", "לעדכן את הכוחות במתרחש ברמה המערכתית"] },
  { id: 27, title: "אזעקה בשגרה", situation: "אזעקה מתרחשת באמצע פעילות שגרתית.", affectedSequences: "שליטה, ודאות", recommendedActions: ["תיווך מתמיד של המציאות המבצעית (להסביר מה השתנה ולמה)", "לאפשר לכוחות לעבד את המעבר"] },
  { id: 28, title: "הסטת משימה מפתיעה", situation: "מתקבלת משימה שמסיטה מהתכנון המקורי.", affectedSequences: "ודאות, שליטה", recommendedActions: ["פירוק המערכה ליעדים תקופתיים קצרי טווח לשמירת תחושת התקדמות", "לומר במפורש כאשר אין ודאות"] },
  { id: 29, title: "פער בין מפקדה לשטח", situation: "מתגלה פער בין הדיווחים מהמפקדה למציאות.", affectedSequences: "ודאות, מסוגלות", recommendedActions: ["לעודד שיח ביקורתי מבוקר והעלאת ספקות", "תיווך מתמיד של המציאות המבצעית"] },
  { id: 30, title: "התלבטות בהצפת בעיה", situation: "מפקד מתלבט אם להציף בעיה לדרג מעליו.", affectedSequences: "שליטה, מסוגלות", recommendedActions: ["לעודד העלאת ספקות מקצועיים", "שגרות למידה קצרות למניעת נקודות עיוורון"] },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Seed dilemmas using upsert to avoid duplicates
  for (const d of dilemmasData) {
    await prisma.dilemma.upsert({
      where: { id: d.id },
      update: {
        title: d.title,
        situation: d.situation,
        affectedSequences: d.affectedSequences,
        recommendedActions: d.recommendedActions,
      },
      create: d,
    });
  }
  console.log(`✅ Seeded ${dilemmasData.length} dilemmas`);

  // Seed admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'tifkud2024';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.admin.upsert({
    where: { username: adminUsername },
    update: { password: hashedPassword },
    create: { username: adminUsername, password: hashedPassword },
  });
  console.log(`✅ Admin user "${adminUsername}" ready`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
