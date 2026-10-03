% The resume's layout. resume.tex holds only content, in the macros below;
% Quartermaster reads that vocabulary in code (src/quartermaster/resume/tex.py
% in the Quartermaster repo), so a macro added here has to be taught there too.
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2026/10/03 one-page resume]
\LoadClass[11pt,letterpaper]{article}

\RequirePackage[letterpaper,top=0.45in,bottom=0.45in,left=0.5in,right=0.5in]{geometry}
\RequirePackage{fontspec}
% By file name: Tectonic on Windows has no fontconfig to find a family by name.
\setmainfont{texgyretermes}[Extension=.otf,UprightFont=*-regular,BoldFont=*-bold,
  ItalicFont=*-italic,BoldItalicFont=*-bolditalic]
\RequirePackage{xcolor}
\RequirePackage{etoolbox}
\RequirePackage{enumitem}
\RequirePackage[hidelinks,pdfusetitle]{hyperref}

% Spaces shaped by the font, so they reach the PDF as real space characters:
% without it, text extractors run italic words together.
\XeTeXinterwordspaceshaping=2
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\linespread{1.04}
% Ragged right and whole words only: hyphenated line breaks garble the text an
% ATS pulls out. (Not ragged2e: with the space shaping above, Tectonic crashes.)
\raggedright
\hyphenpenalty=10000
\exhyphenpenalty=10000

\definecolor{rule}{gray}{0.6}
\definecolor{linkblue}{HTML}{1155CC}

\newcommand{\sep}{\unskip\ |\ \ignorespaces}
\newcommand{\link}[2]{\href{#1}{\underline{#2}}}
% One line: left text, right text flush to the margin. Each side is boxed at its
% natural width: with the space shaping above, a bare \hfill line sometimes
% stretched the spaces instead.
\newcommand{\leftright}[2]{\par\noindent\hbox to\linewidth{\hbox{#1}\hfill\hbox{#2}}\par}

% \header{name}{contact items separated by \sep}
\newcommand{\header}[2]{%
  \begin{center}
    {\fontsize{20}{24}\selectfont #1}\par\vspace{1pt}
    #2
  \end{center}\vspace{-6pt}}

% \section{title}: a rule, then the title.
\renewcommand{\section}[1]{%
  \par\vspace{5pt}{\color{rule}\hrule height 0.5pt}\vspace{7pt}%
  \textbf{#1}\par}

% \school{id}{school}{location}{dates}{degree}{note}
\newcommand{\school}[6]{%
  \leftright{#2\sep #3}{#4}%
  \leftright{\textit{#5}}{\ifblank{#6}{}{\textit{#6}}}}

% \job{id}{org}{location}{role}{dates}
\newcommand{\job}[5]{%
  #2\sep #3\par
  \leftright{\textit{#4}}{#5}}

% \project{id}{name}{award}{\link{url}{label}}{dates}{summary}
\newcommand{\project}[6]{%
  \leftright{#2\ifblank{#3}{}{\sep #3}\ifblank{#4}{}{\sep{\color{linkblue}#4}}}{#5}%
  \ifblank{#6}{}{\textit{#6}\par}}

% \role{id}{org}{title}{dates}
\newcommand{\role}[4]{\leftright{#2\sep\textit{#3}}{#4}}

% \skills{category}{items}
\newcommand{\skills}[2]{#1: #2\par}

\newenvironment{bullets}{%
  \begin{itemize}[leftmargin=0.5in,labelsep=0.14in,itemsep=0pt,topsep=0pt,parsep=0pt,partopsep=0pt,label=\textbullet]}%
  {\end{itemize}}
