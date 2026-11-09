<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Portfolio conventions
- Keep the portfolio as one content route with anchored sections; its editorial flow shares one identity and contact destination.
- Define visual roles in src/styles.css and use the shared Button for controls; this keeps the whole portfolio consistently themed.
- Use intersection-based section reveals with reduced-motion overrides; animations must not prevent reading or navigation.
- The contact form prepares an encoded mailto message rather than claiming delivery; there is no mail-sending service connected.
