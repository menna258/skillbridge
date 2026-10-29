# SkillBridge

A bilingual (English/Arabic) career development platform for university students, where students buy courses and one admin runs the catalogue.

## Language

### Catalogue and buying

**Course** (كورس):
The thing SkillBridge sells: a set of lessons a Student buys to learn a skill. It is the only kind of product on the site.
_Avoid_: Product, item, منتج

**Student** (طالب):
A person who uses SkillBridge to learn and who buys Courses.
_Avoid_: User, customer, client, buyer

**Free Course** (كورس مجاني):
A Course whose price is zero; any signed-in Student can open its lessons without an Order.
_Avoid_: Trial, sample

**Hidden Course** (كورس مخفي):
A Course the Admin has taken off the catalogue. New Students can't find or buy it, but Students with a Paid Order for it keep it.
_Avoid_: Deleted course, archived course

**Lesson Content** (محتوى الدرس):
What a Student actually studies in a lesson: text and an optional video. Only Students who own the Course can see it; lesson titles stay public.
_Avoid_: Material, resources

**Order** (طلب):
A Student's purchase of exactly one Course, paid with real money through online payment.
_Avoid_: Purchase, transaction, enrolment

**Order Status** (حالة الطلب):
Where an Order stands: **Pending** (checkout started, not paid yet), **Paid** (the payment succeeded), **Failed** (the payment was declined or abandoned), or **Refunded** (the Admin gave the money back and the Student lost the Course).
_Avoid_: State, stage

**Owns** (يمتلك):
A Student owns a Course when it is a Free Course that isn't Hidden, or they have a Paid Order for it. Hiding a Free Course closes it to everyone, since nobody holds an Order for it.
_Avoid_: Enrolled, has access, unlocked

### Running the site

**Admin** (الأدمن):
The single person who runs SkillBridge: manages Courses, reviews Orders and reads Contact Messages. There is exactly one.
_Avoid_: Owner, staff, moderator

**Admin Inbox** (إيميل الأدمن):
The one shared email address that receives a notice for every new Order.
_Avoid_: Admin email, notification address

**Contact Message** (رسالة تواصل):
A message a visitor sends through the Contact form.
_Avoid_: Inquiry, ticket, feedback
