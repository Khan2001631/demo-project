const markdownit = require('markdown-it');

export const getCookie = (name: string) => {
  const regex = new RegExp(`(^| )${name}=([^;]+)`)
  const match = document.cookie.match(regex)
  if (match) {
    return match[2]
  }
}
export const clearCookies = (name: string) => {
  document.cookie = name + '=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export const AskGPTMessages = [
  'I am analyzing your question to provide the best answer.',
  'I am gathering information to craft a thorough response.',
  'I am almost there, fine-tuning your personalized answer.'
];

export const convertMarkdownToHtml = (markdown: any, rootClass: any) => {
  var md = markdownit();
  var htmlContent = md.render(markdown);

  var textSizeClass = '';
  switch (rootClass) {
    case 'stdTextS':
      textSizeClass = 'stdTextS';
      break;
    case 'stdText':
      textSizeClass = 'stdText';
      break;
    case 'stdTextL':
      textSizeClass = 'stdTextL';
      break;
    case 'stdTextXL':
      textSizeClass = 'stdTextXL';
      break;
    default:
      textSizeClass = 'stdText';
  }

  // Replace <strong> tags with Bootstrap classes
  htmlContent = htmlContent.replace(/<strong>(.*?)<\/strong>/g, '<strong class="font-weight-bold">$1</strong>');

  // Apply root class to <p> and <li> elements
  htmlContent = htmlContent.replace(/<p>/g, `<p class="${textSizeClass}">`);
  htmlContent = htmlContent.replace(/<li>/g, `<li class="${textSizeClass}">`);

  // Add "markdownTableBLC" class to all <table> elements
  htmlContent = htmlContent.replace(/<table/g, `<table class="markdownTableBLC table ${textSizeClass}"`);

  // Apply root class to <th> elements within <table>
  htmlContent = htmlContent.replace(/<th>/g, `<th class="${textSizeClass}">`);

  // Apply root class to <td> elements within <table>
  htmlContent = htmlContent.replace(/<td>/g, `<td class="${textSizeClass}">`);

  // Remove escaped HTML tags
  htmlContent = htmlContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

  // Remove escaped HTML tags and specified tags
  htmlContent = htmlContent.replace(/&lt;pre id=&quot;markdownTableBLC&quot;&gt;/g, '').replace(/&lt;\/pre&gt;/g, '');
  htmlContent = htmlContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  return htmlContent;
}


export const toggleCaptchaBadge = (show: boolean) => {
  const badge = document.getElementsByClassName('grecaptcha-badge')[0];
  if (badge && badge instanceof HTMLElement) {
    badge.style.visibility = show ? 'visible' : 'hidden';
  }
};


export const FormatDate = (currentDate: any) => {
  currentDate = new Date(currentDate);
  // Get the month name
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthName = monthNames[currentDate.getMonth()];

  // Get the day and year
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Format the date string
  const formattedDate = `${monthName}, ${day}/${year}`;

  // Display the formatted date
  return formattedDate
}

export const getPageByURL = (url: string): string | undefined => {
  const pages: { [key: string]: string } = {
    '/login': 'login',
    '/forgotpwd': 'forgotpwd',
    '/home': 'home',
    '/app/askgpt': 'io',
    '/app/prompts/create': 'dtd',
    '/app/prompts/edit': 'dtd',
    '/app/userProfileEdit': 'profileEdit',
    '/app/accountDashboard': 'accountDashboard',
    '/app/companyPortal': 'companyPortal',
    '/app/prompts/approval': 'approval',
    '/app/orgCoinManagement': 'coinManagement',
    '/app/PaymentNewCard': 'cardPayment',
    '/app/payout': 'payout',
    '/app/uploadUsers': 'uploadUsers',
    '/app/updatePwd': 'updatePwd',
  };

  for (let key in pages) {
    if (url.includes(key)) {
      return pages[key];
    }
  }
}



export const convertToThousands = (x: number | string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}