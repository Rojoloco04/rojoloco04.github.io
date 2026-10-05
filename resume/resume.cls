% The resume's layout. resume.tex holds only content, in the macros below;
% Quartermaster reads that vocabulary in code (src/quartermaster/resume/tex.py
% in the Quartermaster repo), so a macro added here has to be taught there too.
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{resume}[2026/10/03 one-page resume]
\LoadClass[11pt,letterpaper]{article}

\RequirePackage[letterpaper,top=0.4in,bottom=0.4in,left=0.5in,right=0.5in]{geometry}
\RequirePackage{fontspec}
% By file name: Tectonic on Windows has no fontconfig to find a family by name.
% Scaled to a round size that keeps the page to one.
\setmainfont{Cabin}[Scale=0.95,Extension=.otf,UprightFont=*-Regular,
  BoldFont=*-Bold,ItalicFont=*-Italic,BoldItalicFont=*-BoldItalic]
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
% The font is scaled below the 11pt it's set at, so the leading comes down with it.
\linespread{1.0}
% Ragged right and whole words only: hyphenated line breaks garble the text an
% ATS pulls out. (Not ragged2e: with the space shaping above, Tectonic crashes.)
\raggedright
\hyphenpenalty=10000
\exhyphenpenalty=10000

\definecolor{rule}{gray}{0.6}
\definecolor{accent}{HTML}{1F3A5F}

\RequirePackage{fontawesome5}
% \icon{Phone}: a Font Awesome glyph (\faPhone) before a contact item.
\newcommand{\icon}[1]{{\color{accent}\csname fa#1\endcsname}\hspace{0.4em}}

\newcommand{\sep}{\unskip\ |\ \ignorespaces}
\newcommand{\link}[2]{\href{#1}{\underline{#2}}}
% Space between entries; \addvspace so it never stacks on a section's own space.
\newcommand{\entryskip}{\par\addvspace{4pt}}
% One line: left text, right text flush to the margin. Each side is boxed at its
% natural width: with the space shaping above, a bare \hfill line sometimes
% stretched the spaces instead.
\newcommand{\leftright}[2]{\par\noindent\hbox to\linewidth{\hbox{#1}\hfill\hbox{#2}}\par}

% \header{name}{contact items separated by \sep}
\newcommand{\header}[2]{%
  \begin{center}
    {\fontsize{24}{28}\selectfont\bfseries\color{accent}#1}\par\vspace{4pt}
    {\renewcommand{\sep}{\unskip\hspace{1.3em}\ignorespaces}%
     \renewcommand{\link}[2]{\href{##1}{##2}}%
     #2}
  \end{center}\vspace{-8pt}}

% \section{title}: the title, then a rule.
\renewcommand{\section}[1]{%
  \par\addvspace{9pt}%
  {\color{accent}\large\bfseries\MakeUppercase{#1}}\par\vspace{3pt}%
  {\color{rule}\hrule height 0.5pt}\par\addvspace{5pt}}

% \school{id}{school}{location}{dates}{degree}{note}
\newcommand{\school}[6]{%
  \entryskip
  \leftright{\textbf{#2}\sep #3}{#4}%
  \leftright{\textit{#5}}{\ifblank{#6}{}{\textit{#6}}}}

% \job{id}{org}{location}{role}{dates}
\newcommand{\job}[5]{%
  \entryskip
  \leftright{\textbf{#2}}{#3}%
  \leftright{\textit{#4}}{#5}}

% \project{id}{name}{award}{\link{url}{label}}{dates}{summary}
\newcommand{\project}[6]{%
  \entryskip
  \leftright{\textbf{#2}\ifblank{#3}{}{\sep\textit{#3}}\ifblank{#4}{}{\sep{\color{accent}#4}}}{#5}%
  \ifblank{#6}{}{\textit{#6}\par}}

% \role{id}{org}{title}{dates}
\newcommand{\role}[4]{\entryskip\leftright{\textbf{#2}\sep\textit{#3}}{#4}}

% \skills{category}{items}
\newcommand{\skills}[2]{\textbf{#1:} #2\par}

\newenvironment{bullets}{%
  \begin{itemize}[leftmargin=0.24in,labelsep=0.1in,itemsep=2.5pt,topsep=1pt,parsep=0pt,partopsep=0pt,label={\small\textbullet}]}%
  {\end{itemize}}
